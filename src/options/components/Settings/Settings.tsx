import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

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
    const history = useHistory();

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
            enabled: filteringEnabled,
        },
        BLOCK_ANNOYANCES: {
            id: 'block_annoyances_option',
            iconId: ICON_ID.ANNOYANCES,
            messageKey: 'options_block_annoyances_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('annoyances', e);
            },
            enabled: false,
        },
        BLOCK_TRACKERS: {
            id: 'block_trackers_option',
            iconId: ICON_ID.TRACKERS_BLOCKING,
            messageKey: 'options_block_trackers_option',
            onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
                // eslint-disable-next-line no-console
                console.log('block_trackers', e);
            },
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
        CUSTOM_FILTERS: {
            id: 'custom_filters',
            iconId: ICON_ID.CUSTOM_FILTERS,
            messageKey: 'options_custom_filters_option',
            onClick: () => {
                history.push('/filters?groupId=0');
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
        OPTIONS.BLOCK_ADS,
        OPTIONS.BLOCK_ANNOYANCES,
        OPTIONS.BLOCK_TRACKERS,
        OPTIONS.BLOCK_SOCIAL_WIDGETS,
    ];

    const arrowOptions: ArrowOption[] = [
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
