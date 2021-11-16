import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { Section } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';
import { rootStore } from '../../stores';
import { CheckboxOption, CheckboxOptionProps } from '../CheckboxOption';
import { NavOption, NavOptionProps } from '../NavOption';
import styles from './Settings.module.pcss';

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const { filteringEnabled, setSetting } = settingsStore;

    const OPTIONS = {
        BLOCK_ADS: {
            // NOTE! The value of the id attribute must be unique within the HTML document.
            id: 'block_ads_option',
            iconId: IconId.AD_BLOCKING,
            messageKey: 'options_block_ads_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, e.target.checked);
            },
            className: styles.optionLabel,
            checked: filteringEnabled,
        },
        BLOCK_ANNOYANCES: {
            id: 'block_annoyances_option',
            iconId: IconId.ANNOYANCES,
            messageKey: 'options_block_annoyances_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('annoyances', e);
            },
            className: styles.optionLabel,
        },
        BLOCK_TRACKERS: {
            id: 'block_trackers_option',
            iconId: IconId.TRACKERS_BLOCKING,
            messageKey: 'options_block_trackers_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('block_trackers', e);
            },
            className: styles.optionLabel,
            enabled: false,
        },
        BLOCK_SOCIAL_WIDGETS: {
            id: 'block_social_widgets_option',
            iconId: IconId.SOCIAL_WIDGETS,
            messageKey: 'options_block_social_widgets_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('block_trackers', e);
            },
            className: styles.optionLabel,
        },
        LANGUAGES: {
            id: 'languages_option',
            iconId: IconId.LANGUAGES,
            messageKey: 'options_languages_option',
            to: '/languages',
        },
        CUSTOM_FILTERS: {
            id: 'custom_filters',
            iconId: IconId.CUSTOM_FILTERS,
            messageKey: 'options_custom_filters_option',
            to: '/customfilters',
        },
        USER_RULES: {
            id: 'user_rules_option',
            iconId: IconId.USER_RULES,
            messageKey: 'options_user_rules_option',
            // FIXME make enum
            to: '/userrules',
        },
    };

    const checkboxOptions: CheckboxOptionProps[] = [
        OPTIONS.BLOCK_ADS,
        OPTIONS.BLOCK_ANNOYANCES,
        OPTIONS.BLOCK_TRACKERS,
        OPTIONS.BLOCK_SOCIAL_WIDGETS,
    ];

    const navOptions: NavOptionProps[] = [
        OPTIONS.LANGUAGES,
        OPTIONS.CUSTOM_FILTERS,
        OPTIONS.USER_RULES,
    ];

    return (
        <>
            <Section
                title={translator.getMessage('options_settings_title')}
            >
                {checkboxOptions.map(CheckboxOption)}
                {navOptions.map(NavOption)}
            </Section>
        </>
    );
});
