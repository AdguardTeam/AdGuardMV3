import { FiltersGroupId } from 'Common/constants/common';
import { IconId } from 'Common/constants/icons';

/**
 * This namespace contains only obsoleted types
 */
namespace Obsolete {
    /**
     * @obsolete Describes filter information
     */
    export interface Filter {
        id: number,
        iconId?: IconId,
        title: string,
        enabled: boolean,
        description?: string,
        groupId: FiltersGroupId,
        url?: string,
        regexpRulesCounter?: number,
        declarativeRulesCounter?: number,
        localeCodes?: string[],
    }

    /**
     * @obsolete Use FILTERS_INFO_STORAGE_KEY
     */
    export const FILTERS_STORAGE_KEY = 'filters';

    /**
     * @obsolete Use FILTERS_INFO_STORAGE_KEY
     */
    export const RULES_STORAGE_KEY = 'rules';

    /**
     * @obsolete Use USER_RULES_STATUS_STORAGE_KEY
     */
    export const USER_RULES_LIMITS_STORAGE_KEY = 'user_rules_limits';
}

export default Obsolete;
