import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { Icon } from 'Common/components/ui/Icon';
import { Checkbox } from 'Common/components/Checkbox';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { ICON_ID, IconIdType } from 'Common/components/ui/Icons';
import { rootStore } from '../../stores';

interface ChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement>): void;
}

interface ClickHandler {
    (e: React.MouseEvent): void;
}

interface Option {
    id: string;
    iconId: IconIdType;
    messageKey: string;
}

interface CheckboxOption extends Option {
    enabled: boolean;
    onChange: ChangeHandler;
}

interface ArrowOption extends Option {
    onClick: ClickHandler;
}

const renderArrowOption = ({
    id, iconId, messageKey, onClick,
}: ArrowOption) => {
    return (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div key={id} className="option__item" onClick={onClick}>
            <Icon id={iconId} />
            <label
                htmlFor={id}
                className="option__label"
            >
                {reactTranslator.getMessage(messageKey)}
            </label>
            <Icon id={ICON_ID.ARROW} />
        </div>
    );
};

const renderCheckboxOption = ({
    id, iconId, enabled, messageKey, onChange,
}: CheckboxOption) => {
    return (
        <div key={id} className="option__item">
            <Icon id={iconId} />
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

export const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const { filteringEnabled, setSetting } = settingsStore;

    const OPTIONS = {
        AD_BLOCKING: {
            // The value of the id attribute must be unique within the HTML document.
            id: 'ad_blocking_option',
            iconId: ICON_ID.AD_BLOCKING,
            messageKey: 'options_ad_blocking_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, e.target.checked);
            },
            enabled: filteringEnabled,
        },
        MISCELLANEOUS: {
            id: 'miscellaneous_option',
            iconId: ICON_ID.MISCELLANEOUS,
            messageKey: 'options_miscellaneous_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('miscellaneous', e);
            },
            enabled: false,
        },
        TRACKERS_BLOCKING: {
            id: 'trackers_blocking_option',
            iconId: ICON_ID.TRACKERS_BLOCKING,
            messageKey: 'options_trackers_blocking_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('trackers_blocking', e);
            },
            enabled: false,
        },
        LANGUAGES: {
            id: 'languages_option',
            iconId: ICON_ID.LANGUAGES,
            messageKey: 'options_languages_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('languages clicked');
            },
        },
        FILTERS: {
            id: 'filters_option',
            iconId: ICON_ID.FILTERS,
            messageKey: 'options_filters_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('filters');
            },
        },
        USER_RULES: {
            id: 'user_rules_option',
            iconId: ICON_ID.USER_RULES,
            messageKey: 'options_user_rules_option',
            onClick: () => {
                // eslint-disable-next-line no-console
                console.log('user_rules');
            },
        },
    };

    const checkboxOptions: CheckboxOption[] = [
        OPTIONS.AD_BLOCKING,
        OPTIONS.MISCELLANEOUS,
        OPTIONS.TRACKERS_BLOCKING,
    ];

    const arrowOptions: ArrowOption[] = [
        OPTIONS.LANGUAGES,
        OPTIONS.FILTERS,
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
