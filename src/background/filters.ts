import { IconId } from 'Common/components/ui';
import {
    FiltersGroupId,
    Filter,
    Rules,
    FILTERS_REGEXP_COUNTER_FILENAME,
    FILTERS_RULES_COUNTER_FILENAME,
    RULESET_NAME,
    FILTERS_VERSIONS_FILENAME,
} from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { ADGUARD_FILTERS_IDS, FILTER_RULESET, RulesetType } from 'Common/constants/filters';
import { RULES_STORAGE_KEY, ENABLED_FILTERS_IDS } from 'Common/constants/storage-keys';
import FiltersUtils from 'Common/utils/filters';
import { arrayToMap } from 'Common/utils/arrays';

import { backend, COMMON_FILTERS_DIR } from './backend';
import { storage } from './storage';

const CUSTOM_FILTERS_START_ID = 1000;

// Titles and descriptions are set to English by default.
// TODO: Translations with watch for change language
// TODO: The language will be determined by the browser and changed to English if necessary.
export const DEFAULT_FILTERS: Filter[] = [
    {
        id: FILTER_RULESET[RulesetType.RULESET_1].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_1].enabled,
        title: 'Russian',
        description: 'Filter that enables ad blocking on websites in the Russian language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['ru', 'ru_RU'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_2].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_2].enabled,
        iconId: IconId.AD_BLOCKING,
        title: translator.getMessage('options_block_ads_option'),
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_14].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_14].enabled,
        iconId: IconId.ANNOYANCES,
        title: translator.getMessage('options_block_annoyances_option'),
        description: translator.getMessage('options_block_annoyances_option_desc'),
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_3].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_3].enabled,
        iconId: IconId.TRACKERS_BLOCKING,
        title: translator.getMessage('options_block_trackers_option'),
        description: translator.getMessage('options_block_trackers_option_desc'),
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_4].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_4].enabled,
        iconId: IconId.SOCIAL_WIDGETS,
        title: translator.getMessage('options_block_social_widgets_option'),
        description: translator.getMessage('options_block_social_widgets_option_desc'),
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_6].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_6].enabled,
        title: 'German',
        // eslint-disable-next-line max-len
        description: 'EasyList Germany + AdGuard German filter. Filter list that specifically removes ads on websites in the German language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['de', 'de_DE'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_7].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_7].enabled,
        title: 'Japanese',
        description: 'Filter that enables ad blocking on websites in the Japanese language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['ja', 'ja_JP'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_8].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_8].enabled,
        title: 'Dutch',
        // eslint-disable-next-line max-len
        description: 'EasyList Dutch + AdGuard Dutch filter. Filter list that specifically removes ads on websites in the Dutch language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['nl', 'nl_NL'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_9].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_9].enabled,
        title: 'Spanish/Portuguese',
        description: 'Filter list that specifically removes ads on websites in the Spanish and Portuguese languages.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['es', 'es_ES', 'pt_PT', 'pt'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_13].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_13].enabled,
        title: 'Turkish',
        description: 'Filter list that specifically removes ads on websites in the Turkish language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['tr', 'tr_TR'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_16].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_16].enabled,
        title: 'French',
        // eslint-disable-next-line max-len
        description: 'Liste FR + AdGuard French filter. Filter list that specifically removes ads on websites in the French language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['fr', 'fr_FR'],
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_224].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_224].enabled,
        title: 'Chinese',
        // eslint-disable-next-line max-len
        description: 'EasyList China + AdGuard Chinese filter. Filter list that specifically removes ads on websites in Chinese language.',
        groupId: FiltersGroupId.LANGUAGES,
        localeCodes: ['zh', 'zh_CN'],
    },
];

class Filters {
    FILTERS_STORAGE_KEY = 'filters';

    filters: Filter[] = [];

    rules: Rules[] = [];

    enableFiltersIds: number[] = [];

    async init() {
        this.filters = await this.getFiltersFromStorage();
        await this.setEnabledIds();

        // TODO: add to storage only those rules that applied by the content script;
        // Read the rules from the storages for each download background sw,
        // if there are no rules, then get the rules from the files;
        // If the rules have changed, get them (on the first lines + check time)
        this.rules = await this.getRules(this.filters);
        await storage.set(RULES_STORAGE_KEY, this.rules);
    }

    getRulesFromFiles = async (): Promise<Rules[]> => {
        const promises = ADGUARD_FILTERS_IDS.map(({ id }) => backend.downloadFilterRules(id));
        return Promise.all(promises);
    };

    getRulesRegexpCountersFromFile = async (): Promise<Map<number, number>> => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/${FILTERS_REGEXP_COUNTER_FILENAME}`);
        const file = await fetch(url);
        const json = await file.json() as Array<Array<number>>;

        return arrayToMap(json);
    };

    getRulesCountersFromFile = async (): Promise<Map<number, number>> => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/${FILTERS_RULES_COUNTER_FILENAME}`);
        const file = await fetch(url);
        const json = await file.json() as Array<Array<number>>;

        return arrayToMap(json);
    };

    /**
     * Returns a list of information about the rule sets specified in the V3 manifest
     */
    public getManifestRulesets = (): ManifestRulesetInfo[] => {
        const {
            declarative_net_request: { rule_resources },
        } = chrome.runtime.getManifest() as chrome.runtime.ManifestV3;

        return rule_resources;
    };

    /**
     * Loads and parses the version of the filters that was included in the extension
     */
    private getFiltersTimestamps = async () => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/${FILTERS_VERSIONS_FILENAME}`);
        const request = await fetch(url);
        const arr = await request.json() as Array<Array<number>>;
        return arrayToMap(arr);
    };

    /**
     * Returns a list of the newest filters (from the storage or from the extension bundle)
     * with their IDs and contents
     */
    private getRules = async (filtersInfo: Filter[]): Promise<Rules[]> => {
        const filtersTimestamps = await this.getFiltersTimestamps();
        const filtersRules = await storage.get<Rules[]>(RULES_STORAGE_KEY);

        // Parse manifest's rulesets' ids
        const filtersIds: number[] = this.getManifestRulesets()
            .map(({ id }: ManifestRulesetInfo) => {
                return Number.parseInt(id.slice(RULESET_NAME.length), 10);
            });

        // For each filters return newest version: from storage or load newest from extension bundle
        const promisesWithRules: Promise<Rules>[] = filtersIds.map((filterId) => {
            const rulesFromStorage = filtersRules?.find(({ id }) => id === filterId);
            if (!rulesFromStorage) {
                return backend.downloadFilterRules(filterId);
            }

            const { timeUpdated } = FiltersUtils.parseFilterInfo(rulesFromStorage.rules.split('\n'), '');
            const timeStamp = filtersTimestamps.get(filterId);

            if (!timeStamp || !timeUpdated || timeStamp > new Date(timeUpdated).getTime()) {
                return backend.downloadFilterRules(filterId);
            }

            return new Promise((resolve) => { resolve(rulesFromStorage); });
        });

        const staticFiltersRules = await Promise.all(promisesWithRules);

        const customFiltersIds = filtersInfo
            .filter(({ groupId }) => groupId === FiltersGroupId.CUSTOM)
            .map(({ id }) => id);
        const customFiltersIdsSet = new Set<number>(customFiltersIds);
        const customFiltersRules = filtersRules?.filter(({ id }) => {
            return customFiltersIdsSet.has(id);
        }) || [];

        return [
            ...staticFiltersRules,
            ...customFiltersRules,
        ];
    };

    // TODO add tests
    addFilter = async (filter: Filter, rules: string) => {
        this.filters.push(filter);
        const { id } = filter;
        this.rules.push({ id, rules });

        await this.saveInStorage(this.filters);
        await storage.set(RULES_STORAGE_KEY, this.rules);

        await this.setEnabledIds();
    };

    removeFilter = async (filterId: number): Promise<Filter[]> => {
        this.filters = this.filters.filter((f) => f.id !== filterId);
        this.rules = this.rules.filter((f) => f.id !== filterId);

        await this.saveInStorage(this.filters);
        await storage.set(RULES_STORAGE_KEY, this.rules);

        await this.setEnabledIds();

        return this.getFilters();
    };

    setEnabledIds = async () => {
        const enableFilters = this.filters.filter((filter) => filter.enabled);
        this.enableFiltersIds = enableFilters.map((filter) => filter.id);
        await storage.set(ENABLED_FILTERS_IDS, this.enableFiltersIds);
    };

    setEnabledFiltersIds = async (ids: number[]) => {
        this.filters = this.filters.map((f) => {
            const enabled = ids.includes(f.id);

            return {
                ...f,
                enabled,
            };
        });

        await this.saveInStorage(this.filters);
        await this.setEnabledIds();
    };

    getEnableFiltersIds = async () => {
        if (this.enableFiltersIds) {
            return this.enableFiltersIds;
        }
        this.enableFiltersIds = await storage.get(ENABLED_FILTERS_IDS) || [];
        return this.enableFiltersIds;
    };

    getFilters = async () => {
        if (this.filters.length !== 0) {
            return this.filters;
        }
        this.filters = await this.getFiltersFromStorage();
        return this.filters;
    };

    getEnabledRules = async () => {
        const enabledIds = await this.getEnableFiltersIds();

        return this.rules.filter((r) => enabledIds.includes(r.id));
    };

    updateFilterState = async (filterId: number, filterProps: Partial<Filter>): Promise<void> => {
        const filter = this.filters.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error(`There is filter with id: ${filterId}`);
        }
        const filterIdx = this.filters.indexOf(filter);
        this.filters[filterIdx] = { ...filter, ...filterProps };

        await this.saveInStorage(this.filters);
        await this.setEnabledIds();
    };

    /**
     * Saves filters state in the storage
     */
    saveInStorage = async (filters: Filter[]) => {
        await storage.set(this.FILTERS_STORAGE_KEY, filters);
    };

    /**
     * Returns filters state from storage with mapped rules and regexps counters
     */
    getFiltersFromStorage = async (): Promise<Filter[]> => {
        const filtersFromStorage = await storage.get<Filter[]>(this.FILTERS_STORAGE_KEY);
        const filters = filtersFromStorage || DEFAULT_FILTERS;

        const regexpCounters = await this.getRulesRegexpCountersFromFile();
        const rulesCounters = await this.getRulesCountersFromFile();
        return filters.map((f) => ({
            ...f,
            regexpRulesCounter: regexpCounters.get(f.id),
            declarativeRulesCounter: rulesCounters.get(f.id),
        }));
    };

    enableFilter = async (filterId: number): Promise<void> => {
        await this.updateFilterState(filterId, { enabled: true });
    };

    disableFilter = async (filterId: number): Promise<void> => {
        await this.updateFilterState(filterId, { enabled: false });
    };

    updateFilterTitle = async (filterId: number, filterTitle: string): Promise<void> => {
        await this.updateFilterState(filterId, { title: filterTitle });
    };

    private getCustomFilterId = () => {
        let max = 0;
        this.filters.forEach((f) => {
            if (f.id > max) {
                max = f.id;
            }
        });

        return max >= CUSTOM_FILTERS_START_ID ? max + 1 : CUSTOM_FILTERS_START_ID;
    };

    addCustomFilterByContent = async (filterStrings: string[], title: string, url: string) => {
        const filterInfo = FiltersUtils.parseFilterInfo(filterStrings, title);

        const filter: Filter = {
            id: this.getCustomFilterId(),
            title: title || filterInfo.title,
            enabled: true,
            description: filterInfo.description || '',
            groupId: FiltersGroupId.CUSTOM,
            url,
        };
        await this.addFilter(filter, filterStrings.join('\n'));
        return this.getFilters();
    };
}

export const filters = new Filters();
