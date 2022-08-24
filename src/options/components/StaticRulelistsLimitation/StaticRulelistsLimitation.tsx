import { observer } from 'mobx-react';
import React, { useContext } from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { LinkToLimits } from 'Common/components/LinkToLimits';

import { rootStore } from '../../stores';

import styles from './StaticRulelistsLimitation.module.pcss';

export const StaticRulelistsLimitation = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const {
        brokenFiltersList,
        isMaxEnabledFilters,
        enabledStaticFiltersCounter,
    } = settingsStore;

    const maxEnabledFiltersError = isMaxEnabledFilters
        && reactTranslator.getMessage(
            'options_static_filters_limits_by_filters',
            {
                'link-to-limits': LinkToLimits,
                'current-enabled': enabledStaticFiltersCounter,
                maximum: chrome.declarativeNetRequest.MAX_NUMBER_OF_ENABLED_STATIC_RULESETS,
            },
        );

    const brokenFiltersListError = brokenFiltersList
        && reactTranslator.getMessage(
            'options_static_filters_limits_after_update',
            { 'link-to-limits': LinkToLimits },
        );

    const isErrors = maxEnabledFiltersError || brokenFiltersListError;
    return isErrors
        ? (
            <section className={styles.limits}>
                <span className={styles.limit}>
                    {maxEnabledFiltersError}
                </span>
                <span className={styles.limit}>
                    {brokenFiltersListError}
                </span>
            </section>
        )
        : null;
});
