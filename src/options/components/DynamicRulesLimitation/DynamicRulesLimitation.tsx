import { observer } from 'mobx-react';
import React, { useContext } from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { LinkToLimits } from 'Common/components/LinkToLimits';

import { rootStore } from '../../stores';

import styles from './DynamicRulesLimitation.module.pcss';

export const DynamicRulesLimitation = observer(() => {
    const { optionsStore } = useContext(rootStore);

    const {
        userRulesRegexpsCount,
        userRulesDeclarativeRulesCount,
        isMaxEnabledDynamicRules,
        isMaxEnabledDynamicRulesRegexps,
    } = optionsStore;

    const maxEnabledRulesError = isMaxEnabledDynamicRules
        && reactTranslator.getMessage('options_dynamic_rules_limit', {
            'link-to-limits': LinkToLimits,
            'current-enabled': userRulesDeclarativeRulesCount,
            maximum: chrome.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES,
        });

    const maxEnabledRegexpsError = isMaxEnabledDynamicRulesRegexps
        && reactTranslator.getMessage('options_dynamic_rules_regexps_limit', {
            'link-to-limits': LinkToLimits,
            'current-enabled': userRulesRegexpsCount,
            maximum: chrome.declarativeNetRequest.MAX_NUMBER_OF_REGEX_RULES,
        });

    const isErrors = maxEnabledRulesError || maxEnabledRegexpsError;
    return isErrors
        ? (
            <section className={styles.limits}>
                <span className={styles.limit}>
                    {maxEnabledRulesError}
                </span>
                <span className={styles.limit}>
                    {maxEnabledRegexpsError}
                </span>
            </section>
        )
        : null;
});
