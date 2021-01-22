import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from '../../../common/translators/reactTranslator';
import { Icon } from '../../../common/components/ui/Icon';
import { Checkbox } from '../../../common/components/Checkbox';
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
    enabled: boolean;
    messageKey: string;
    onChange: ChangeHandler;
}

interface ClickHandler {
    (e: React.SyntheticEvent): void;
}

interface ArrowOption {
    id: string;
    messageKey: string;
    onClick: ClickHandler;
}

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const { setProtectionEnabled, protectionEnabled } = settingsStore;

    const OPTIONS = {
        AD_BLOCKING: {
            id: 'ad_blocking',
            messageKey: 'options_ad_blocking_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                await setProtectionEnabled(e.target.checked);
            },
            enabled: protectionEnabled,
        },
        MISCELLANEOUS: {
            id: 'miscellaneous',
            messageKey: 'options_miscellaneous_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('miscellaneous', e);
            },
            enabled: false,
        },
        TRACKERS_BLOCKING: {
            id: 'trackers_blocking',
            messageKey: 'options_trackers_blocking_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('trackers_blocking', e);
            },
            enabled: false,
        },
        LANGUAGES: {
            id: 'languages',
            messageKey: 'options_languages_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('languages clicked');
            },
        },
        FILTERS: {
            id: 'filters',
            messageKey: 'options_filters_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('filters');
            },
        },
        USER_RULES: {
            id: 'user_rules',
            messageKey: 'options_user_rules_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('user_rules');
            },
        },
    };

    const renderArrowOption = ({ id, messageKey, onClick }: ArrowOption) => {
        return (
            // eslint-disable-next-line max-len
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div key={id} className="option__item" onClick={onClick}>
                <Icon id={id} className="icon--option" />
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
        id, enabled, messageKey, onChange,
    }: CheckboxOption) => {
        return (
            <div key={id} className="option__item">
                <Icon id={id} className="icon--option" />
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

    return (
        <>
            <h1 className="h1">
                {reactTranslator.getMessage('options_settings_title')}
            </h1>
            <div className="option__container">
                {renderCheckboxOption(OPTIONS.AD_BLOCKING)}
                {renderCheckboxOption(OPTIONS.MISCELLANEOUS)}
                {renderCheckboxOption(OPTIONS.TRACKERS_BLOCKING)}
                {renderArrowOption(OPTIONS.LANGUAGES)}
                {renderArrowOption(OPTIONS.FILTERS)}
                {renderArrowOption(OPTIONS.USER_RULES)}
            </div>
        </>
    );
});
