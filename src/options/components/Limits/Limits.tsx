import React from 'react';
import cn from 'classnames';

import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { MV3 } from 'Common/constants/urls';

import { Warning } from './Warning';
import styles from './Limits.module.pcss';

const STATIC_RULESETS_LIMIT = 150000;
const STATIC_FILTERS_LIMIT = 10;
const STATIC_REGEXP_LIMIT = 1000;
const DYNAMIC_RULES_LIMIT = 5000;
const DYNAMIC_REGEXP_LIMIT = 1000;
// TODO fix me
const currentDynamicRules = 4200;
// TODO fix me
const currentDynamicRegexp = 100;
// TODO fix me
const currentFiltersLimit = 5;
// TODO fix me
const currentStaticRulesets = 22000;
// TODO fix me
const currentStaticRegexp = 500;

export const Limits = () => {
    return (
        <div className={styles.limits}>
            <h2 className={theme.common.headingMain}>
                {reactTranslator.getMessage('options_limits_title')}
            </h2>
            <div className={theme.common.headingSecondary}>
                <div>
                    {reactTranslator.getMessage('options_limits_desc_specifications')}
                </div>
                <div>
                    <a
                        href={MV3}
                        className={theme.common.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {reactTranslator.getMessage('options_limits_link_about_mv3')}
                    </a>
                </div>
            </div>
            <Warning />
            <div className={styles.block}>
                <div className={styles.title}>
                    {reactTranslator.getMessage('options_limits_dynamic_title')}
                </div>
                <div className={styles.desc}>
                    {reactTranslator.getMessage('options_limits_dynamic_added')}
                </div>
                <div className={cn(styles.value, theme.colors.yellow)}>
                    {reactTranslator.getMessage(
                        'options_value_of_value',
                        { first_value: currentDynamicRules, second_value: DYNAMIC_RULES_LIMIT },
                    )}
                </div>
                <div className={styles.desc}>
                    {reactTranslator.getMessage('options_limits_regex')}
                </div>
                <div className={cn(styles.value, theme.colors.yellow)}>
                    {reactTranslator.getMessage(
                        'options_value_of_value',
                        { first_value: currentDynamicRegexp, second_value: DYNAMIC_REGEXP_LIMIT },
                    )}
                </div>
            </div>
            <div className={styles.block}>
                <div className={styles.title}>
                    {reactTranslator.getMessage('options_limits_static_title')}
                </div>
                <div className={styles.desc}>
                    {reactTranslator.getMessage(
                        'options_limits_static_rulesets_desc',
                        { count: STATIC_FILTERS_LIMIT },
                    )}
                </div>
                <div className={cn(styles.value, theme.colors.green)}>
                    {reactTranslator.getMessage(
                        'options_value_of_value',
                        { first_value: currentFiltersLimit, second_value: STATIC_FILTERS_LIMIT },
                    )}
                </div>
            </div>
            <div className={styles.block}>
                <div className={styles.title}>
                    {reactTranslator.getMessage('options_limits_static_rules_title')}
                </div>
                <div className={styles.desc}>
                    {reactTranslator.getMessage(
                        'options_limits_static_rules_desc',
                        { count: STATIC_RULESETS_LIMIT },
                    )}
                </div>
                <div className={cn(styles.value, theme.colors.yellow)}>
                    {reactTranslator.getMessage(
                        'options_value_of_value',
                        // TODO fix N
                        { first_value: currentStaticRulesets, second_value: 'N' },
                    )}
                </div>
                <div className={styles.desc}>
                    {reactTranslator.getMessage('options_limits_regex')}
                </div>
                <div className={cn(styles.value, theme.colors.yellow)}>
                    {reactTranslator.getMessage(
                        'options_value_of_value',
                        { first_value: currentStaticRegexp, second_value: STATIC_REGEXP_LIMIT },
                    )}
                </div>
            </div>
        </div>
    );
};
