import { FilterInfo } from 'Common/constants/common';

export default class FiltersUtils {
    // Look up no more than 50 first lines
    public static FIRST_N_LINES = 50;

    /**
     * Parses filter metadata from rules header
     *
     * @param rules
     * @param title - string to be used as title if title tag wouldn't be found
     * @returns object
     */
    public static parseFilterInfo = (rules: string[], title: string): FilterInfo => {
        const parseTag = (tagName: string): string => {
            let result = '';

            const maxLines = Math.min(FiltersUtils.FIRST_N_LINES, rules.length);
            for (let i = 0; i < maxLines; i += 1) {
                const rule = rules[i];
                const search = `! ${tagName}: `;
                const indexOfSearch = rule.indexOf(search);
                if (indexOfSearch >= 0) {
                    result = rule.substring(indexOfSearch + search.length);
                }
            }

            if (tagName === 'Expires') {
                result = String(FiltersUtils.parseExpiresStr(result));
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

    /**
     * Parses expires tag
     */
    private static parseExpiresStr = (str: string): number => {
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
     * Returns the parsed version of the specified rules or creates a new one with the current date
     */
    public static getTimestampForFilter(rules: string[]) {
        const { timeUpdated } = FiltersUtils.parseFilterInfo(rules, '');
        return timeUpdated?.trim() || new Date().toISOString();
    }
}
