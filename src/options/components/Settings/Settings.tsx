import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { ICON_ID } from 'Common/components/ui';
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
            iconId: ICON_ID.AD_BLOCKING,
            messageKey: 'options_block_ads_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, e.target.checked);
            },
            className: styles.optionLabel,
            checked: filteringEnabled,
        },
        BLOCK_ANNOYANCES: {
            id: 'block_annoyances_option',
            iconId: ICON_ID.ANNOYANCES,
            messageKey: 'options_block_annoyances_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('annoyances', e);
            },
            className: styles.optionLabel,
        },
        BLOCK_TRACKERS: {
            id: 'block_trackers_option',
            iconId: ICON_ID.TRACKERS_BLOCKING,
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
            iconId: ICON_ID.SOCIAL_WIDGETS,
            messageKey: 'options_block_social_widgets_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('block_trackers', e);
            },
            className: styles.optionLabel,
        },
        LANGUAGES: {
            id: 'languages_option',
            iconId: ICON_ID.LANGUAGES,
            messageKey: 'options_languages_option',
            to: '/',
        },
        CUSTOM_FILTERS: {
            id: 'custom_filters',
            iconId: ICON_ID.CUSTOM_FILTERS,
            messageKey: 'options_custom_filters_option',
            to: '/filters?groupId=0',
        },
        USER_RULES: {
            id: 'user_rules_option',
            iconId: ICON_ID.USER_RULES,
            messageKey: 'options_user_rules_option',
            // FIXME make enum
            to: '/userRules',
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
            <h1 className={styles.h1}>
                {reactTranslator.getMessage('options_settings_title')}
            </h1>
            <div className={styles.optionContainer}>
                {checkboxOptions.map(CheckboxOption)}
                {navOptions.map(NavOption)}
            </div>
        </>
    );
});
