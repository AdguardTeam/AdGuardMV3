import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { Filter, FiltersGroupId } from 'Common/constants/common';
import { Section } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';

import { rootStore } from '../../stores';
import { SwitcherOption } from '../SwitcherOption';
import { NavOption, NavOptionProps } from '../NavOption';

import styles from './Settings.module.pcss';

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const {
        filters, disableFilter, enableFilter,
    } = settingsStore;

    const OPTIONS = {
        LANGUAGES: {
            id: 'languages_option',
            iconId: IconId.LANGUAGES,
            messageKey: 'options_languages_option',
            messageKeyDesc: 'options_languages_option_desc',
            to: '/languages',
        },
        CUSTOM_FILTERS: {
            id: 'custom_filters',
            iconId: IconId.CUSTOM_FILTERS,
            messageKey: 'options_custom_filters_option',
            messageKeyDesc: 'options_custom_filters_option_desc',
            to: '/customfilters',
        },
        USER_RULES: {
            id: 'user_rules_option',
            iconId: IconId.USER_RULES,
            messageKey: 'options_user_rules_option',
            messageKeyDesc: 'options_user_rules_option_desc',
            // FIXME make enum
            to: '/userrules',
        },
    };

    const navOptions: NavOptionProps[] = [
        OPTIONS.LANGUAGES,
        OPTIONS.CUSTOM_FILTERS,
        OPTIONS.USER_RULES,
    ];

    const onChange = async (filter: Filter) => {
        if (filter.enabled) {
            await disableFilter(filter.id);
        } else {
            await enableFilter(filter.id);
        }
    };

    const mainFilters = filters.filter((i: Filter) => i.groupId === FiltersGroupId.MAIN);

    return (
        <>
            <Section
                title={translator.getMessage('options_settings_title')}
            >
                {mainFilters.map((filter) => (
                    <SwitcherOption
                        key={filter.id}
                        iconId={filter.iconId}
                        id={filter.id.toString()}
                        className={styles.optionLabel}
                        messageKey={filter.title}
                        messageKeyDesc={filter.description}
                        checked={filter.enabled}
                        onChange={() => { onChange(filter); }}
                    />
                ))}
                {navOptions.map(NavOption)}
            </Section>
        </>
    );
});
