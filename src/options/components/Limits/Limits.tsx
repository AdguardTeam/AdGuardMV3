import React, {
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { RULE_SET_NAME_PREFIX } from '@adguard/tswebextension/mv3';

import { theme } from 'Common/styles';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { FiltersGroupId } from 'Common/constants/common';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { MV3 } from 'Common/constants/urls';
import { IconId } from 'Common/components/ui';

import { rootStore } from '../../stores';

import styles from './Limits.module.pcss';
import { Warning } from './Warning';

const {
    MAX_NUMBER_OF_REGEX_RULES,
    MAX_NUMBER_OF_ENABLED_STATIC_RULESETS,
} = chrome.declarativeNetRequest;

export const Limits = observer(() => {
    const [nowEnabledIds, setNowEnabledIds] = useState<number[]>([]);

    const {
        uiStore,
        optionsStore,
        settingsStore,
    } = useContext(rootStore);

    const {
        userRulesEnabledCount,
        userRulesMaximumCount,
        userRulesRegexpsEnabledCount,
        userRulesRegexpsMaximumCount,
    } = optionsStore;

    const {
        filters,
        enabledStaticRules,
        enabledStaticFiltersRegexps,
        enabledStaticFiltersCounter,
        availableStaticRulesCount,
        closeUpdatedFiltersListWarning,
    } = settingsStore;

    useEffect(() => {
        const f = async () => {
            const enabledRulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
            const ids = enabledRulesets.map((s) => {
                return Number.parseInt(s.slice(RULE_SET_NAME_PREFIX.length), 10);
            });
            setNowEnabledIds(ids);
        };
        f();
    }, []);

    const filtersNamesMap: Map<number, string> = new Map<number, string>();
    filters.forEach((f) => {
        if (f.groupId === FiltersGroupId.LANGUAGES) {
            filtersNamesMap.set(f.id, f.title);
        } else {
            const title = reactTranslator.getMessage(f.title) as string;
            filtersNamesMap.set(f.id, title);
        }
    });

    const { settings: { [SETTINGS_NAMES.FILTERS_CHANGED]: wasEnabledIds } } = settingsStore;
    const showWarning = wasEnabledIds.length > 0;

    const relaunchFilteringAndNotify = async () => {
        await settingsStore.relaunchFiltering(wasEnabledIds);

        if (showWarning) {
            uiStore.addNotification(
                reactTranslator.getMessage('options_limits_static_filters_limit_still_exceed'),
                IconId.RED_WARNING,
            );
        } else {
            uiStore.addNotification(
                reactTranslator.getMessage('options_limits_static_filters_reactivated'),
                IconId.CHECKMARK,
            );
        }
    };

    const renderCounter = (current: number, max: number) => {
        const textColor = current >= max ? theme.colors.yellow : theme.colors.green;

        return (
            <div className={cn(styles.value, textColor)}>
                {reactTranslator.getMessage('options_value_of_value', { current, max })}
            </div>
        );
    };

    const descWithCounter = (desc: ReactNode, current: number, max: number) => (
        <>
            <div className={styles.desc}>
                {desc}
            </div>
            { renderCounter(current, max) }
        </>
    );

    return (
        <div className={styles.limits}>
            <h2 className={theme.common.headingMain}>
                {reactTranslator.getMessage('options_limits_title')}
            </h2>

            <div className={cn(theme.common.headingSecondary, styles.extraSpace)}>
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

            {
                showWarning && (
                    <Warning
                        nowEnabled={nowEnabledIds.map((id) => filtersNamesMap.get(id)).join(',')}
                        wasEnabled={wasEnabledIds.map((id) => filtersNamesMap.get(id)).join(',')}
                        onClickReactivateFilters={relaunchFilteringAndNotify}
                        onClickCloseWarning={closeUpdatedFiltersListWarning}
                    />
                )
            }

            <div className={styles.block}>
                <div className={styles.title}>
                    {reactTranslator.getMessage('options_limits_dynamic_title')}
                </div>

                {descWithCounter(
                    reactTranslator.getMessage('options_limits_dynamic_added'),
                    userRulesEnabledCount,
                    userRulesMaximumCount,
                )}

                {descWithCounter(
                    reactTranslator.getMessage('options_limits_regex'),
                    userRulesRegexpsEnabledCount,
                    userRulesRegexpsMaximumCount,
                )}
            </div>

            <div className={styles.block}>
                <div className={styles.title}>
                    {reactTranslator.getMessage('options_limits_static_title')}
                </div>

                {descWithCounter(
                    reactTranslator.getMessage(
                        'options_limits_static_rulesets_desc',
                        { count: MAX_NUMBER_OF_ENABLED_STATIC_RULESETS },
                    ),
                    enabledStaticFiltersCounter,
                    MAX_NUMBER_OF_ENABLED_STATIC_RULESETS,
                )}
            </div>

            <div className={styles.block}>
                <div className={styles.title}>
                    {reactTranslator.getMessage('options_limits_static_rules_title')}
                </div>

                {descWithCounter(
                    reactTranslator.getMessage(
                        'options_limits_static_rules_desc',
                        { count: enabledStaticRules + availableStaticRulesCount },
                    ),
                    enabledStaticRules,
                    enabledStaticRules + availableStaticRulesCount,
                )}

                {descWithCounter(
                    reactTranslator.getMessage('options_limits_regex'),
                    enabledStaticFiltersRegexps,
                    MAX_NUMBER_OF_REGEX_RULES,
                )}
            </div>
        </div>
    );
});
