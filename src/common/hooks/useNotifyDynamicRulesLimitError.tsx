import { useContext } from 'react';

import { rootStore } from 'Options/stores';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { DYNAMIC_RULES_LIMITS_ERROR } from 'Options/stores/OptionsStore';
import { LinkToLimits } from 'Common/components/LinkToLimits';
import { IconId } from 'Common/components/ui/Icons';

const {
    MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES,
    MAX_NUMBER_OF_REGEX_RULES,
} = chrome.declarativeNetRequest;

/**
 * Returns a function that will check for an error if the dynamic rule limit is violated
 * and display a notification to the user in this case
 */
export const useNotifyDynamicRulesLimitsError = () => {
    const {
        uiStore,
        optionsStore,
    } = useContext(rootStore);

    return (error: DYNAMIC_RULES_LIMITS_ERROR | null) => {
        if (error === null) {
            return;
        }

        switch (error) {
            case DYNAMIC_RULES_LIMITS_ERROR.MAX_DYNAMIC_REGEXPS_EXCEED: {
                const message = reactTranslator.getMessage('options_dynamic_rules_limit', {
                    'link-to-limits': LinkToLimits,
                    'current-enabled': optionsStore.userRulesDeclarativeRulesCount,
                    maximum: MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES,
                });
                uiStore.addNotification(message, IconId.RED_WARNING);
                break;
            }
            case DYNAMIC_RULES_LIMITS_ERROR.MAX_DYNAMIC_RULES_EXCEED: {
                const message = reactTranslator.getMessage('options_dynamic_rules_regexps_limit', {
                    'link-to-limits': LinkToLimits,
                    'current-enabled': optionsStore.userRulesRegexpsCount,
                    maximum: MAX_NUMBER_OF_REGEX_RULES,
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
