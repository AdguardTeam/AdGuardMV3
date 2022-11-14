import { USER_FILTER_ID } from '@adguard/tswebextension/mv3';

import { IconId } from 'Common/components/ui';
import { FiltersGroupId, FilterInfo, Rules } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { FILTER_RULESET, RulesetType } from 'Common/constants/filters';
import {
    CUSTOM_FILTERS_RULES_STORAGE_KEY,
    ENABLED_FILTERS_IDS,
    FILTERS_INFO_STORAGE_KEY,
} from 'Common/constants/storage-keys';
import FiltersUtils from 'Common/utils/filters';

import { storage } from './storage';

export type FiltersNames = {
    [filterId: number]: string;
};

const CUSTOM_FILTERS_START_ID = 1000;

// Titles and descriptions are set to English by default.
// TODO: Translations with watch for change language
export const DEFAULT_FILTERS: FilterInfo[] = [
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

/**
 * Filters class contains information about static and custom filters
 */
class Filters {
    private filtersInfo: FilterInfo[] = [];

    private customFiltersRules: Rules[] = [];

    private enableFiltersIds: number[] = [];

    private filtersNames: FiltersNames = {};

    /**
     * Initializes filters module
     */
    async init() {
        this.filtersInfo = await this.getFiltersInfoFromStorage();
        await this.saveEnabledFilterIds();

        this.customFiltersRules = await this.getCustomFiltersRules(this.filtersInfo);
        await storage.set(CUSTOM_FILTERS_RULES_STORAGE_KEY, this.customFiltersRules);

        this.enableFiltersIds = await storage.get(ENABLED_FILTERS_IDS) || [];

        this.filtersInfo.forEach(({ id, title }) => {
            this.filtersNames[id] = title;
        });
        this.filtersNames[USER_FILTER_ID] = 'user rules';
    }

    /**
     * Returns rules for custom filters
     */
    private getCustomFiltersRules = async (filtersInfo: FilterInfo[]): Promise<Rules[]> => {
        const filtersRules = await storage.get<Rules[]>(CUSTOM_FILTERS_RULES_STORAGE_KEY);

        const customFiltersIds = filtersInfo
            .filter(({ groupId }) => groupId === FiltersGroupId.CUSTOM)
            .map(({ id }) => id);
        const customFiltersIdsSet = new Set<number>(customFiltersIds);

        return filtersRules?.filter(({ id }) => customFiltersIdsSet.has(id)) || [];
    };

    /**
     * Removes custom filter
     * @param filterId
     */
    removeCustomFilter = async (filterId: number): Promise<FilterInfo[]> => {
        this.filtersInfo = this.filtersInfo.filter((f) => f.id !== filterId);
        this.customFiltersRules = this.customFiltersRules.filter((f) => f.id !== filterId);

        await storage.set(FILTERS_INFO_STORAGE_KEY, this.filtersInfo);
        await storage.set(CUSTOM_FILTERS_RULES_STORAGE_KEY, this.customFiltersRules);

        await this.saveEnabledFilterIds();

        return this.getFiltersInfo();
    };

    /**
     * Saves enabled filters ids to the storage
     */
    private saveEnabledFilterIds = async () => {
        const enableFilters = this.filtersInfo.filter((filter) => filter.enabled);
        this.enableFiltersIds = enableFilters.map((filter) => filter.id);
        await storage.set(ENABLED_FILTERS_IDS, this.enableFiltersIds);
    };

    /**
     * Updates and saves enabled filters ids to the storage
     */
    setEnabledFiltersIds = async (ids: number[]) => {
        for (let i = 0; i < this.filtersInfo.length; i += 1) {
            const f = this.filtersInfo[i];
            f.enabled = ids.includes(f.id);
        }

        await storage.set(FILTERS_INFO_STORAGE_KEY, this.filtersInfo);
        await this.saveEnabledFilterIds();
    };

    /**
     * Returns enabled filters ids
     */
    getEnableFiltersIds = () => {
        return this.enableFiltersIds;
    };

    /**
     * Returns filters info
     */
    getFiltersInfo = () => {
        return this.filtersInfo;
    };

    /**
     * Returns text rules for enabled custom filters
     */
    getEnabledCustomFiltersRules = () => {
        const enabledIds = this.getEnableFiltersIds();

        return this.customFiltersRules.filter((r) => enabledIds.includes(r.id));
    };

    /**
     * General method to change filters information
     * @param filterId
     * @param filterProps
     */
    private updateFilterState = async (filterId: number, filterProps: Partial<FilterInfo>): Promise<void> => {
        const filter = this.filtersInfo.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error(`There is filter with id: ${filterId}`);
        }
        const filterIdx = this.filtersInfo.indexOf(filter);
        this.filtersInfo[filterIdx] = { ...filter, ...filterProps };

        await storage.set(FILTERS_INFO_STORAGE_KEY, this.filtersInfo);
        await this.saveEnabledFilterIds();
    };

    /**
     * Returns filters state from storage
     */
    getFiltersInfoFromStorage = async (): Promise<FilterInfo[]> => {
        const filtersFromStorage = await storage.get<FilterInfo[]>(FILTERS_INFO_STORAGE_KEY);
        const filters = filtersFromStorage || DEFAULT_FILTERS;

        return filters;
    };

    /**
     * Enables filter by provided id
     * @param filterId
     */
    enableFilter = async (filterId: number): Promise<void> => {
        await this.updateFilterState(filterId, { enabled: true });
    };

    /**
     * Disables filter by provided id
     * @param filterId
     */
    disableFilter = async (filterId: number): Promise<void> => {
        await this.updateFilterState(filterId, { enabled: false });
    };

    /**
     * Updates filter's title filter by provided id
     * @param filterId
     */
    updateFilterTitle = async (filterId: number, filterTitle: string): Promise<void> => {
        await this.updateFilterState(filterId, { title: filterTitle });
    };

    /**
     * Gets available custom filter id
     */
    private getCustomFilterId = () => {
        let max = 0;
        this.filtersInfo.forEach((f) => {
            if (f.id > max) {
                max = f.id;
            }
        });

        return max >= CUSTOM_FILTERS_START_ID ? max + 1 : CUSTOM_FILTERS_START_ID;
    };

    /**
     * Returns an object where the filter id is the key and the filter name
     * is the value
     * @returns @see {@link FiltersNames}
     */
    public getFiltersNames(): FiltersNames {
        return this.filtersNames;
    }

    /**
     * Adds custom filter
     * @param filterStrings
     * @param title
     * @param url
     */
    addCustomFilter = async (content: string[], title: string, url: string) => {
        const filterMetaData = FiltersUtils.parseFilterInfo(content, title);

        const filterInfo: FilterInfo = {
            id: this.getCustomFilterId(),
            title: title || filterMetaData.title,
            enabled: true,
            description: filterMetaData.description || '',
            groupId: FiltersGroupId.CUSTOM,
            url,
        };

        this.filtersInfo.push(filterInfo);
        await storage.set(FILTERS_INFO_STORAGE_KEY, this.filtersInfo);

        this.customFiltersRules.push({
            id: filterInfo.id,
            rules: content.join('\n'),
        });
        await storage.set(CUSTOM_FILTERS_RULES_STORAGE_KEY, this.customFiltersRules);

        await this.saveEnabledFilterIds();

        return this.getFiltersInfo();
    };
}

export const filters = new Filters();
