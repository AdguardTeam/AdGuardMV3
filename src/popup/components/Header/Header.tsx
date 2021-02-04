import React from 'react';

import { translator } from 'Common/translators/translator';
import { Icon } from 'Common/components/ui/Icon';
import { sender } from '../../messaging/sender';

import './header.pcss';

export const Header = () => {
    const handleBlockAdsClick = async () => {
        // TODO - handle block ads click, launching assistant
        await sender.openAssistant();
        window.close();
    };

    const handleSettingsClick = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await sender.openOptions();
        window.close();
    };

    return (
        <div className="popup-header">
            <div className="popup-header__logo">
                <Icon id="logo" className="icon--logo" />
            </div>
            <div className="popup-header__buttons">
                <button
                    type="button"
                    onClick={handleBlockAdsClick}
                    title={translator.getMessage('options_block_ads_on_website')}
                >
                    <Icon id="start" className="icon--button" />
                </button>
                <button
                    type="button"
                    onClick={handleSettingsClick}
                    title={translator.getMessage('options_open_settings')}
                >
                    <Icon id="settings" className="icon--button" />
                </button>
            </div>
        </div>
    );
};
