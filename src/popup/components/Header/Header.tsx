import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { translator } from 'Common/translators/translator';
import { Icon } from 'Common/components/ui/Icon';
import { Tooltip } from 'Common/components/ui/Tooltip';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { GLOBAL_FILTERING_PAUSE_TIMEOUT } from 'Common/constants';
import { sender } from '../../messaging/sender';
import { rootStore } from '../../stores';

import styles from './Header.module.pcss';

export const Header = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        protectionEnabled,
        protectionPausedTimeout,
    } = settingsStore;

    const handleBlockAdsClick = async () => {
        await sender.openAssistant();
        window.close();
    };

    const handleSettingsClick = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await sender.openOptions();
        window.close();
    };

    const onPauseProtectionClick = async () => {
        await sender.setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, false);
    };

    const onPauseProtectionTimeoutClick = async () => {
        await sender.setSetting(
            SETTINGS_NAMES.GLOBAL_FILTERING_PAUSE_EXPIRES,
            Date.now() + GLOBAL_FILTERING_PAUSE_TIMEOUT,
        );
    };

    const protectionDisabled = !protectionEnabled || protectionPausedTimeout > 0;

    const className = cn(styles.popupHeader, {
        [styles.popupHeaderDisabled]: protectionDisabled,
    });

    // TODO: align icons
    return (
        <div className={className}>
            <div className={styles.popupHeaderLogo}>
                <Icon id="logo" className="icon--logo" />
            </div>
            <div className={styles.popupHeaderButtons}>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={handleBlockAdsClick}
                    title={translator.getMessage('options_block_ads_on_website')}
                    disabled={protectionDisabled}
                >
                    <Icon id="start" className="icon--button" />
                </button>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={handleSettingsClick}
                    title={translator.getMessage('options_open_settings')}
                    disabled={protectionDisabled}
                >
                    <Icon id="settings" className="icon--button" />
                </button>
                <Tooltip iconId="crumbs" className={styles.popupHeaderButton} disabled={protectionDisabled}>
                    <div>
                        <button
                            type="button"
                            className={styles.item}
                            onClick={onPauseProtectionClick}
                        >
                            {reactTranslator.getMessage('popup_settings_pause_protection')}
                        </button>
                        <button
                            type="button"
                            className={styles.item}
                            onClick={onPauseProtectionTimeoutClick}
                        >
                            {reactTranslator.getMessage('popup_settings_pause_protection_temporarily')}
                        </button>
                        <button
                            type="button"
                            className={styles.item}
                            disabled
                        >
                            {reactTranslator.getMessage('popup_settings_disable_site_temporarily')}
                        </button>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
});
