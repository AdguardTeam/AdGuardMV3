// TODO store filters in the storage
import { IconId } from 'Common/components/ui';
import {
    FILTER_RULESET, RulesetType, FiltersGroupId,
} from 'Common/constants';
import { storage } from './storage';

const CUSTOM_FILTERS_START_ID = 1000;

const filterRuleset = Object.values(FILTER_RULESET);

const DEFAULT_FILTERS = [
    {
        id: FILTER_RULESET[RulesetType.RULESET_2],
        iconId: IconId.AD_BLOCKING,
        title: 'options_block_ads_option',
        enabled: false,
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_9],
        iconId: IconId.ANNOYANCES,
        title: 'options_block_annoyances_option',
        enabled: true,
        description: 'options_block_annoyances_option_desc',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_3],
        iconId: IconId.TRACKERS_BLOCKING,
        title: 'options_block_trackers_option',
        enabled: true,
        description: 'options_block_trackers_option_desc',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_4],
        iconId: IconId.SOCIAL_WIDGETS,
        title: 'options_block_social_widgets_option',
        enabled: true,
        description: 'options_block_social_widgets_option_desc',
        groupId: FiltersGroupId.MAIN,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_1],
        title: 'Russian',
        enabled: false,
        description: 'Russian filter description',
        groupId: FiltersGroupId.LANGUAGES,
    },
    {
        id: FILTER_RULESET[RulesetType.RULESET_14],
        title: 'Spanish',
        enabled: true,
        description: 'Spanish filter description',
        groupId: FiltersGroupId.LANGUAGES,
    },
];

class Filters {
    FILTERS_STORAGE_KEY = 'filters';

    filters: Filter[] = [];

    async init() {
        this.filters = await this.getFromStorage();
        await this.setRulesetsOptions();
    }

    addFilter = (filter: Filter) => {
        // TODO save in storage
        this.filters.push(filter);
    };

    removeFilter = (filterId: number): Filter[] => {
        // TODO save in storage
        this.filters = this.filters.filter((f) => f.id !== filterId);
        return this.filters;
    };

    genRulesetId = (id: number) => {
        return `ruleset_${id}`;
    };

    setRulesetsOptions = async () => {
        // filter enabled & not custom
        const enableRulesetIds = this.filters
            .filter((filter) => filterRuleset.includes(filter.id) && filter.enabled)
            .map((filter) => this.genRulesetId(filter.id));

        const disableRulesetIds = this.filters
            .filter((filter) => filterRuleset.includes(filter.id) && !filter.enabled)
            .map((filter) => this.genRulesetId(filter.id));

        await this.setRulesets({ enableRulesetIds, disableRulesetIds });
    };

    getFilters = (): Filter[] => {
        return this.filters;
    };

    setRulesets = async (options: chrome.declarativeNetRequest.UpdateRulesetOptions) => {
        await chrome.declarativeNetRequest.updateEnabledRulesets(options);
    };

    updateFilterState = async (filterId: number, filterProps: Partial<Filter>): Promise<void> => {
        const filter = this.filters.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error(`There is filter with id: ${filterId}`);
        }
        const filterIdx = this.filters.indexOf(filter);
        this.filters[filterIdx] = { ...filter, ...filterProps };

        await this.setRulesetsOptions();
        await this.saveInStorage(this.filters);
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
    getFromStorage = async () => {
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

    addCustomFilterByContent = (filterStrings: [], title: string) => {
        const filterInfo = this.parseFilterInfo(filterStrings, title);
        const filter: Filter = {
            id: this.getCustomFilterId(),
            title: title || filterInfo.title,
            enabled: true,
            description: filterInfo.description || '',
            groupId: FiltersGroupId.CUSTOM,
        };
        this.addFilter(filter);
        return this.getFilters();
    };
}

export const filters = new Filters();
