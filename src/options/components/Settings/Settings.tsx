import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { FilterInfo, FiltersGroupId } from 'Common/constants/common';
import { Section } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';
import { FILTER_RULESET, RulesetType } from 'Common/constants/filters';

import { useNotifyStaticFiltersLimitError } from '../../hooks/useNotifyStaticFiltersLimitError';
import { rootStore } from '../../stores';
import { SwitcherOption } from '../SwitcherOption';
import { NavOption, NavOptionProps } from '../NavOption';
import { StaticRulelistsLimitation } from '../StaticRulelistsLimitation';

import styles from './Settings.module.pcss';

// constant declared outside the component to prevent unnecessary work on re-renders
export const FILTERS_TRANSLATIONS = {
    [FILTER_RULESET[RulesetType.RULESET_2].id]: {
        id: FILTER_RULESET[RulesetType.RULESET_2].id,
        title: translator.getMessage('options_block_ads_option'),
    },
    [FILTER_RULESET[RulesetType.RULESET_14].id]: {
        id: FILTER_RULESET[RulesetType.RULESET_14].id,
        title: translator.getMessage('options_block_annoyances_option'),
        description: translator.getMessage('options_block_annoyances_option_desc'),
    },
    [FILTER_RULESET[RulesetType.RULESET_3].id]: {
        id: FILTER_RULESET[RulesetType.RULESET_3].id,
        title: translator.getMessage('options_block_trackers_option'),
        description: translator.getMessage('options_block_trackers_option_desc'),
    },
    [FILTER_RULESET[RulesetType.RULESET_4].id]: {
        id: FILTER_RULESET[RulesetType.RULESET_4].id,
        title: translator.getMessage('options_block_social_widgets_option'),
        description: translator.getMessage('options_block_social_widgets_option_desc'),
    },
};

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const checkAndNotifyStaticFiltersError = useNotifyStaticFiltersLimitError();

    const {
        filters,
        ruleSetsCounters,
        enableFilter,
        disableFilter,
    } = settingsStore;

    const OPTIONS = {
        LANGUAGES: {
            id: 'languages_option',
            iconId: IconId.LANGUAGES,
            message: translator.getMessage('options_languages_option'),
            messageDesc: translator.getMessage('options_languages_option_desc'),
            to: '/languages',
        },
        CUSTOM_FILTERS: {
            id: 'custom_filters',
            iconId: IconId.CUSTOM_FILTERS,
            message: translator.getMessage('options_custom_filters_option'),
            messageDesc: translator.getMessage('options_custom_filters_option_desc'),
            to: '/customfilters',
        },
        USER_RULES: {
            id: 'user_rules_option',
            iconId: IconId.USER_RULES,
            message: translator.getMessage('options_user_rules_option'),
            messageDesc: translator.getMessage('options_user_rules_option_desc'),
            // TODO: make enum
            to: '/userrules',
        },
    };

    const navOptions: NavOptionProps[] = [
        OPTIONS.LANGUAGES,
        OPTIONS.CUSTOM_FILTERS,
        OPTIONS.USER_RULES,
    ];

    const tryEnableFilter = async (filterId: number) => {
        const err = await enableFilter(filterId);
        checkAndNotifyStaticFiltersError(err);
    };

    const onChange = async (filter: FilterInfo) => {
        if (filter.enabled) {
            await disableFilter(filter.id);
        } else {
            await tryEnableFilter(filter.id);
        }
    };

    const mainFilters = filters
        .filter((i: FilterInfo) => i.groupId === FiltersGroupId.MAIN)
        .map((f: FilterInfo) => {
            // do not save translations in the storage,
            // otherwise on language change they won't be updated
            const { title, description } = FILTERS_TRANSLATIONS[f.id];
            return {
                ...f,
                title,
                description,
            };
        });

    const getRulesMessage = (filterId: number) => {
        const ruleSet = ruleSetsCounters.find((r) => r.filterId === filterId);
        const count = ruleSet?.rulesCount;

        return count !== undefined
            ? translator.getPlural('options_filter_rules_counter', count, { count })
            : '';
    };

    return (
        <>
            <Section
                title={translator.getMessage('options_settings_title')}
            >
                <StaticRulelistsLimitation />
                {mainFilters.map((filter) => (
                    <SwitcherOption
                        key={filter.id}
                        iconId={filter.iconId}
                        id={filter.id.toString()}
                        className={styles.optionLabel}
                        message={filter.title}
                        messageDesc={filter.description ? filter.description : ''}
                        checked={filter.enabled}
                        onChange={() => { onChange(filter); }}
                        title={getRulesMessage(filter.id)}
                    />
                ))}
                {navOptions.map(NavOption)}
            </Section>
        </>
    );
});
