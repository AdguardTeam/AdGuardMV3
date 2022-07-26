import { useContext } from 'react';

import { rootStore } from 'Options/stores';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { STATIC_FILTERS_LIMITS_ERROR } from 'Options/stores/SettingsStore';
import { LinkToLimits } from 'Common/components/LinkToLimits';
import { IconId } from 'Common/components/ui/Icons';

/**
 * Returns a function that will check for an error if the static filters limit is violated
 * and display a notification to the user in this case
 */
export const useNotifyStaticFiltersLimitError = () => {
    const {
        uiStore,
    } = useContext(rootStore);

    return (error: STATIC_FILTERS_LIMITS_ERROR | null) => {
        if (error === null) {
            return;
        }

        switch (error) {
            case STATIC_FILTERS_LIMITS_ERROR.MAX_STATIC_RULES_EXCEED: {
                const message = reactTranslator.getMessage(
                    'options_static_filters_limits_by_rules',
                    { 'link-to-limits': LinkToLimits },
                );
                uiStore.addNotification(message, IconId.RED_WARNING);
                break;
            }
            case STATIC_FILTERS_LIMITS_ERROR.MAX_STATIC_REGEXPS_EXCEED: {
                const message = reactTranslator.getMessage(
                    'options_static_filters_limits_by_regexp',
                    { 'link-to-limits': LinkToLimits },
                );
                uiStore.addNotification(message, IconId.RED_WARNING);
                break;
            }
            case STATIC_FILTERS_LIMITS_ERROR.MAX_STATIC_FILTERS_EXCEED: {
                const message = reactTranslator.getMessage(
                    'options_static_filters_limits_by_filters_notification',
                    { 'link-to-limits': LinkToLimits },
                );
                uiStore.addNotification(message, IconId.RED_WARNING);
                break;
            }
            default: {
                break;
            }
        }
    };
};
