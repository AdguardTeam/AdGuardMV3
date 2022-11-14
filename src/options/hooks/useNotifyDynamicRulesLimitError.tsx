import { useContext } from 'react';

import { rootStore } from 'Options/stores';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { DYNAMIC_RULES_LIMITS_ERROR, OptionsStore } from 'Options/stores/OptionsStore';
import { LinkToLimits } from 'Common/components/LinkToLimits';
import { IconId } from 'Common/components/ui/Icons';

/**
 * Returns a function that will check for an error if the dynamic rule limit is violated
 * and display a notification to the user in this case
 */
export const useNotifyDynamicRulesLimitsError = () => {
    const { uiStore } = useContext(rootStore);

    return (optionsStore: OptionsStore, error: DYNAMIC_RULES_LIMITS_ERROR | null) => {
        const {
            userRulesEnabledCount,
            userRulesTotalCount,
            userRulesRegexpsEnabledCount,
            userRulesRegexpsTotalCount,
        } = optionsStore;

        if (error === null) {
            return;
        }

        switch (error) {
            case DYNAMIC_RULES_LIMITS_ERROR.MAX_DYNAMIC_RULES_EXCEED: {
                const message = reactTranslator.getMessage('options_dynamic_rules_limit', {
                    'link-to-limits': LinkToLimits,
                    'current-enabled': userRulesEnabledCount,
                    maximum: userRulesTotalCount,
                });
                uiStore.addNotification(message, IconId.RED_WARNING);
                break;
            }
            case DYNAMIC_RULES_LIMITS_ERROR.MAX_DYNAMIC_REGEXPS_EXCEED: {
                const message = reactTranslator.getMessage('options_dynamic_rules_regexps_limit', {
                    'link-to-limits': LinkToLimits,
                    'current-enabled': userRulesRegexpsEnabledCount,
                    maximum: userRulesRegexpsTotalCount,
                });
                uiStore.addNotification(message, IconId.RED_WARNING);
                break;
            }
            default: {
                break;
            }
        }
    };
};
