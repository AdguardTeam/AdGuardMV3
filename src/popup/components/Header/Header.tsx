import React from 'react';

import { translator } from '../../../common/translators/translator';
import { Icon } from '../../../common/components/ui/Icon';

import './header.pcss';

export const Header = () => {
    const handleBlockAdsClick = () => {
        /* FIXME - enable blocking mode */
        window.close();
    };

    const handleSettingsClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        /* FIXME - openSettingsTab */
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
