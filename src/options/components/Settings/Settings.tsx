import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { Icon } from 'Common/components/ui/Icon';
import { Checkbox } from 'Common/components/Checkbox';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { rootStore } from '../../stores';

interface Option {
    iconId: string;
    optionName: string;
    renderControl: (option?: Option) => React.ReactElement;
}

interface ChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement>): void;
}

interface CheckboxOption {
    id: string;
    iconId: string;
    enabled: boolean;
    messageKey: string;
    onChange: ChangeHandler;
}

interface ClickHandler {
    (e: React.SyntheticEvent): void;
}

interface ArrowOption {
    id: string;
    iconId: string;
    messageKey: string;
    onClick: ClickHandler;
}

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const history = useHistory();

    const { filteringEnabled, setSetting } = settingsStore;

    const OPTIONS = {
        BLOCK_ADS: {
            // NOTE! The value of the id attribute must be unique within the HTML document.
            id: 'block_ads_option',
            iconId: 'block_ads',
            messageKey: 'options_block_ads_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, e.target.checked);
            },
            enabled: filteringEnabled,
        },
        BLOCK_ANNOYANCES: {
            id: 'block_annoyances_option',
            iconId: 'annoyances',
            messageKey: 'options_block_annoyances_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('annoyances', e);
            },
            enabled: false,
        },
        BLOCK_TRACKERS: {
            id: 'block_trackers_option',
            iconId: 'block_trackers',
            messageKey: 'options_block_trackers_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('block_trackers', e);
            },
            enabled: false,
        },
        BLOCK_SOCIAL_WIDGETS: {
            id: 'block_social_widgets_option',
            iconId: 'social_widgets',
            messageKey: 'options_block_social_widgets_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('block_trackers', e);
            },
            enabled: false,
        },
        LANGUAGES: {
            id: 'languages_option',
            iconId: 'languages',
            messageKey: 'options_languages_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('languages clicked');
            },
        },
        CUSTOM_FILTERS: {
            id: 'custom_filters',
            iconId: 'custom_filters_icon',
            messageKey: 'options_custom_filters_option',
            onClick: () => {
                history.push('/filters?groupId=0');
            },
        },
        USER_RULES: {
            id: 'user_rules_option',
            iconId: 'user_rules',
            messageKey: 'options_user_rules_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('user_rules');
            },
        },
    };

    const renderArrowOption = ({
        id, iconId, messageKey, onClick,
    }: ArrowOption) => {
        return (
            // eslint-disable-next-line max-len
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div key={id} className="option__item" onClick={onClick}>
                <Icon id={iconId} className="icon--option" />
                <label
                    htmlFor={id}
                    className="option__label"
                >
                    {reactTranslator.getMessage(messageKey)}
                </label>
                <Icon className="icon--option" id="arrow" />
            </div>
        );
    };

    const renderCheckboxOption = ({
        id, iconId, enabled, messageKey, onChange,
    }: CheckboxOption) => {
        return (
            <div key={id} className="option__item">
                <Icon id={iconId} className="icon--option" />
                <label
                    htmlFor={id}
                    className="option__label"
                >
                    {reactTranslator.getMessage(messageKey)}
                </label>
                <Checkbox id={id} checked={enabled} onChange={onChange} />
            </div>
        );
    };

    const checkboxOptions = [
        OPTIONS.BLOCK_ADS,
        OPTIONS.BLOCK_ANNOYANCES,
        OPTIONS.BLOCK_TRACKERS,
        OPTIONS.BLOCK_SOCIAL_WIDGETS,
    ];

    const arrowOptions = [
        OPTIONS.LANGUAGES,
        OPTIONS.CUSTOM_FILTERS,
        OPTIONS.USER_RULES,
    ];

    return (
        <>
            <h1 className="h1">
                {reactTranslator.getMessage('options_settings_title')}
            </h1>
            <div className="option__container">
                {checkboxOptions.map(renderCheckboxOption)}
                {arrowOptions.map(renderArrowOption)}
            </div>
        </>
    );
});
