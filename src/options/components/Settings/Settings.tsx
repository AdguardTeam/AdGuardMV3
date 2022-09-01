import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { Filter, FiltersGroupId } from 'Common/constants/common';
import { Section } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';

import { useNotifyStaticFiltersLimitError } from '../../hooks/useNotifyStaticFiltersLimitError';
import { rootStore } from '../../stores';
import { SwitcherOption } from '../SwitcherOption';
import { NavOption, NavOptionProps } from '../NavOption';
import { StaticRulelistsLimitation } from '../StaticRulelistsLimitation';

import styles from './Settings.module.pcss';

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const checkAndNotifyStaticFiltersError = useNotifyStaticFiltersLimitError();

    const {
        filters,
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

    const onChange = async (filter: Filter) => {
        if (filter.enabled) {
            await disableFilter(filter.id);
        } else {
            await tryEnableFilter(filter.id);
        }
    };

    const mainFilters = filters.filter((i: Filter) => i.groupId === FiltersGroupId.MAIN);

    const getRulesMessage = (count: number) => (
        translator.getPlural('options_filter_rules_counter', count, { count })
    );

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
                        title={getRulesMessage(filter.declarativeRulesCounter || 0)}
                    />
                ))}
                {navOptions.map(NavOption)}
            </Section>
        </>
    );
});
