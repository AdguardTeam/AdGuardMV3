import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { reactTranslator } from 'Common/translators/reactTranslator';

import { rootStore } from '../../stores';

import styles from './DynamicRulesLimitation.module.pcss';

export const DynamicRulesLimitation = observer(() => {
    const { optionsStore } = useContext(rootStore);

    const {
        userRulesEnabledCount,
        userRulesTotalCount,
        userRulesRegexpsEnabledCount,
        userRulesRegexpsTotalCount,
        isUserRulesLimitExceed,
        isUserRulesRegexpsLimitExceed,
    } = optionsStore;

    const maxEnabledRulesError = isUserRulesLimitExceed
        && reactTranslator.getMessage('options_dynamic_rules_limit_on_page', {
            'current-enabled': userRulesEnabledCount,
            maximum: userRulesTotalCount,
        });

    const maxEnabledRegexpsError = isUserRulesRegexpsLimitExceed
        && reactTranslator.getMessage('options_dynamic_rules_regexps_limit_on_page', {
            'current-enabled': userRulesRegexpsEnabledCount,
            maximum: userRulesRegexpsTotalCount,
        });

    const isErrors = maxEnabledRulesError || maxEnabledRegexpsError;
    return isErrors
        ? (
            <section className={styles.limits}>
                {maxEnabledRulesError && (
                    <div className={styles.limit}>
                        {maxEnabledRulesError}
                    </div>
                )}
                {maxEnabledRegexpsError && (
                    <div className={styles.limit}>
                        {maxEnabledRegexpsError}
                    </div>
                )}
                <Link
                    className={styles.notificationLink}
                    to="/limits"
                >
                    {reactTranslator.getMessage('options_limits_title')}
                </Link>
            </section>
        )
        : null;
});
