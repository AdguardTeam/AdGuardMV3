import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { translator } from 'Common/translators/translator';
import { Icon } from 'Common/components/ui/Icon';
import { Tooltip } from 'Common/components/ui/Tooltip';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { sender } from '../../messaging/sender';
import styles from './Header.module.pcss';
import { rootStore } from '../../stores';

export const Header = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { setSetting } = settingsStore;

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
        await setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, false);
    };

    const onPauseProtectionTimeoutClick = async () => {
        await setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, false);
        setInterval(async () => {
            await setSetting(SETTINGS_NAMES.PROTECTION_PAUSED_TIMEOUT,
                settingsStore.protectionPausedTimeout as number - 1);
        }, 1000);
    };

    // TODO: align icons
    return (
        <div className={styles.popupHeader}>
            <div className={styles.popupHeaderLogo}>
                <Icon id="logo" className="icon--logo" />
            </div>
            <div className={styles.popupHeaderButtons}>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={handleBlockAdsClick}
                    title={translator.getMessage('options_block_ads_on_website')}
                >
                    <Icon id="start" className="icon--button" />
                </button>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={handleSettingsClick}
                    title={translator.getMessage('options_open_settings')}
                >
                    <Icon id="settings" className="icon--button" />
                </button>
                <Tooltip iconId="crumbs" className={styles.popupHeaderButton}>
                    <ul>
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                        <li
                            className={styles.item}
                            onClick={onPauseProtectionClick}
                        >
                            {reactTranslator.getMessage('popup_settings_pause_protection')}
                        </li>
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                        <li
                            className={styles.item}
                            onClick={onPauseProtectionTimeoutClick}
                        >
                            {reactTranslator.getMessage('popup_settings_pause_for_30_seconds')}
                        </li>
                        <li
                            className={styles.item}
                        >
                            {reactTranslator.getMessage('popup_settings_disable_for_30_seconds')}
                        </li>
                    </ul>
                </Tooltip>
            </div>
        </div>
    );
});
