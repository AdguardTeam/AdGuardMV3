// TODO store filters in the storage
import { CUSTOM_GROUP_ID } from 'Common/constants';

const CUSTOM_FILTERS_START_ID = 1000;

class Filters {
    filters: Filter[] = [
        {
            id: 1, title: 'Custom filter 1', enabled: true, description: 'Custom filter description', groupId: 0,
        },
        {
            id: 2, title: 'Custom filter 2', enabled: false, description: 'Custom filter description', groupId: 0,
        },
        {
            id: 3, title: 'Custom filter 3', enabled: false, description: 'Custom filter description', groupId: 0,
        },
        {
            id: 4, title: 'English', enabled: false, description: 'English filter description', groupId: 1,
        },
        {
            id: 5, title: 'Russian', enabled: false, description: 'Russian filter description', groupId: 1,
        },
    ];

    addFilter = (filter: Filter) => {
        this.filters.push(filter);
    };

    removeFilter = (filterId: number): Filter[] => {
        this.filters = this.filters.filter((f) => f.id !== filterId);
        return this.filters;
    };

    getFilters = (): Filter[] => {
        return this.filters;
    };

    updateFilterState = (filterId: number, filterProps: Partial<Filter>): void => {
        const filter = this.filters.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error(`There is filter with id: ${filterId}`);
        }
        const filterIdx = this.filters.indexOf(filter);
        const updatedFilter = { ...filter, ...filterProps };
        this.filters.splice(filterIdx, 1, updatedFilter);
    };

    enableFilter = (filterId: number): void => {
        this.updateFilterState(filterId, { enabled: true });
    };

    disableFilter = (filterId: number): void => {
        this.updateFilterState(filterId, { enabled: false });
    };

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
            title: filterInfo.title,
            enabled: true,
            description: filterInfo.description || '',
            groupId: CUSTOM_GROUP_ID,
        };
        this.addFilter(filter);
        return this.getFilters();
    };
}

export const filters = new Filters();
