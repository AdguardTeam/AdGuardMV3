import { IconId } from 'Common/components/ui';
import {
    FiltersGroupId,
    Filter,
    Rules,
    FilterInfo,
    RULESET_NAME,
} from 'Common/constants/common';
import { FILTER_RULESET, RulesetType, ADGUARD_FILTERS_IDS } from 'Common/constants/filters';
import { RULES_STORAGE_KEY, ENABLED_FILTERS_IDS } from 'Common/constants/storage-keys';
import { backend } from './backend';
import { storage } from './storage';

const CUSTOM_FILTERS_START_ID = 1000;

// Titles and descriptions are set to English by default.
// TODO: Translations with watch for change language
// TODO: The language will be determined by the browser and changed to English if necessary.
const DEFAULT_FILTERS: Filter[] = [
    {
        id: FILTER_RULESET[RulesetType.RULESET_1].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_1].enabled,
        title: 'AdGuard Russian filter',
        description: 'Filter that enables ad blocking on websites in the Russian language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_2].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_2].enabled,
        iconId: IconId.AD_BLOCKING,
        title: 'options_block_ads_option',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_3].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_3].enabled,
        iconId: IconId.TRACKERS_BLOCKING,
        title: 'options_block_trackers_option',
        description: 'options_block_trackers_option_desc',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_4].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_4].enabled,
        iconId: IconId.SOCIAL_WIDGETS,
        title: 'options_block_social_widgets_option',
        description: 'options_block_social_widgets_option_desc',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_6].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_6].enabled,
        title: 'AdGuard German filter',
        // eslint-disable-next-line max-len
        description: 'EasyList Germany + AdGuard German filter. Filter list that specifically removes ads on websites in the German language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_7].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_7].enabled,
        title: 'AdGuard Japanese filter',
        description: 'Filter that enables ad blocking on websites in the Japanese language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_8].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_8].enabled,
        title: 'AdGuard Dutch filter',
        // eslint-disable-next-line max-len
        description: 'EasyList Dutch + AdGuard Dutch filter. Filter list that specifically removes ads on websites in the Dutch language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_9].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_9].enabled,
        title: 'AdGuard Spanish/Portuguese filter',
        description: 'Filter list that specifically removes ads on websites in the Spanish and Portuguese languages.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_13].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_13].enabled,
        title: 'AdGuard Turkish filter',
        description: 'Filter list that specifically removes ads on websites in the Turkish language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_14].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_14].enabled,
        iconId: IconId.ANNOYANCES,
        title: 'options_block_annoyances_option',
        description: 'options_block_annoyances_option_desc',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_16].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_16].enabled,
        title: 'AdGuard French filter',
        // eslint-disable-next-line max-len
        description: 'Liste FR + AdGuard French filter. Filter list that specifically removes ads on websites in the French language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_224].id,
        enabled: FILTER_RULESET[RulesetType.RULESET_224].enabled,
        title: 'AdGuard Chinese filter',
        // eslint-disable-next-line max-len
        description: 'EasyList China + AdGuard Chinese filter. Filter list that specifically removes ads on websites in Chinese language.',
        groupId: FiltersGroupId.LANGUAGES,
    },
];

class Filters {
    FILTERS_STORAGE_KEY = 'filters';

    filters: Filter[] = [];

    rules: Rules[] = [];

    enableFiltersIds: number[] = [];

    async init() {
        const getRulesFromFiles = async () => {
            const promises = ADGUARD_FILTERS_IDS.map(({ id }) => backend.downloadFilterRules(id));
            const result = await Promise.all(promises);
            return result;
        };

        // TODO add to storage only those rules that applied by the content script;
        // Read the rules from the storages for each download background sw,
        // if there are no rules, then get the rules from the files;
        // If the rules have changed, get them (on the first lines + check time)
        this.rules = await this.getRulesFromStorage() || await getRulesFromFiles();
        await storage.set(RULES_STORAGE_KEY, this.rules);

        this.filters = await this.getFromStorage();
        await this.setEnabledIds();
    }

    getRulesFromStorage = async () => {
        const rules = await storage.get<Rules[]>(RULES_STORAGE_KEY);
        return rules;
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

    genRulesetId = (id: number) => {
        return `${RULESET_NAME}${id}`;
    };

    setEnabledIds = async () => {
        const enableFilters = this.filters.filter((filter) => filter.enabled);
        this.enableFiltersIds = enableFilters.map((filter) => filter.id);
        await storage.set(ENABLED_FILTERS_IDS, this.enableFiltersIds);
    };

    getEnableFiltersIds = async () => {
        if (this.enableFiltersIds) {
            return this.enableFiltersIds;
        }
        this.enableFiltersIds = await storage.get(ENABLED_FILTERS_IDS);
        return this.enableFiltersIds;
    };

    getFilters = async () => {
        if (this.filters.length !== 0) {
            return this.filters;
        }
        this.filters = await this.getFromStorage();
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
     * Returns filters state from storage
     */
    getFromStorage = async (): Promise<Filter[]> => {
        const filters = await storage.get<Filter[]>(this.FILTERS_STORAGE_KEY);
        return filters ?? DEFAULT_FILTERS;
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

    // TODO move to helpers
    private parseExpiresStr = (str: string): number => {
        const regexp = /(\d+)\s+(day|hour)/;

        const parseRes = str.match(regexp);

        if (!parseRes) {
            const parsed = Number.parseInt(str, 10);
            return Number.isNaN(parsed) ? 0 : parsed;
        }

        const [, num, period] = parseRes;

        let multiplier = 1;
        switch (period) {
            case 'day': {
                multiplier = 24 * 60 * 60;
                break;
            }
            case 'hour': {
                multiplier = 60 * 60;
                break;
            }
            default: {
                break;
            }
        }

        return multiplier * parseInt(num, 10);
    };

    /**
     * // TODO move to helpers
     * Parses filter metadata from rules header
     *
     * @param rules
     * @param title - string to be used as title if title tag wouldn't be found
     * @returns object
     */
    parseFilterInfo = (rules: string[], title: string): FilterInfo => {
        const parseTag = (tagName: string): string => {
            let result = '';

            // Look up no more than 50 first lines
            const maxLines = Math.min(50, rules.length);
            for (let i = 0; i < maxLines; i += 1) {
                const rule = rules[i];
                const search = `! ${tagName}: `;
                const indexOfSearch = rule.indexOf(search);
                if (indexOfSearch >= 0) {
                    result = rule.substring(indexOfSearch + search.length);
                }
            }

            if (tagName === 'Expires') {
                result = String(this.parseExpiresStr(result));
            }

            return result;
        };

        return {
            title: parseTag('Title') || title,
            description: parseTag('Description'),
            homepage: parseTag('Homepage'),
            version: parseTag('Version'),
            expires: parseTag('Expires'),
            timeUpdated: parseTag('TimeUpdated'),
        };
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
        const filterInfo = this.parseFilterInfo(filterStrings, title);

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
