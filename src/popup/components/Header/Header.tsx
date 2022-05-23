import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { translator } from 'Common/translators/translator';
import { Icon, Tooltip, IconId } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { PROTECTION_PAUSE_TIMEOUT_S, PROTECTION_PAUSE_TIMEOUT_MS } from 'Common/constants';
import { sender } from '../../messaging/sender';
import { rootStore } from '../../stores';

import styles from './Header.module.pcss';

export const Header = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        protectionEnabled,
        setProtectionPausedTimer,
        setSetting,
        updateCurrentTime,
        currentUrl,
        enableFiltersIds,
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
        await setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, false);
        await sender.reloadActiveTab();
    };

    const onPauseProtectionTimeoutClick = async () => {
        await setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, false);
        await sender.reloadActiveTab();
        updateCurrentTime();
        await sender.setPauseExpires(settingsStore.currentTime + PROTECTION_PAUSE_TIMEOUT_MS);
        setProtectionPausedTimer();
    };

    // TODO remove fieldset child buttons disable after the bug is fixed https://github.com/facebook/react/issues/7711
    return (
        <div className={styles.popupHeader}>
            <div className={styles.popupHeaderLogo}>
                <Icon id={IconId.LOGO} />
            </div>
            <fieldset className={styles.popupHeaderButtons} disabled={!protectionEnabled}>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={handleBlockAdsClick}
                    title={translator.getMessage('options_block_ads_on_website')}
                    disabled={!protectionEnabled}
                >
                    <Icon id={IconId.START} />
                </button>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={handleSettingsClick}
                    title={translator.getMessage('options_open_settings')}
                    disabled={!protectionEnabled}
                >
                    <Icon id={IconId.SETTINGS} />
                </button>
                <Tooltip
                    iconId={IconId.CRUMBS}
                    className={styles.popupHeaderButton}
                    enabled={protectionEnabled}
                >
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
                        {reactTranslator.getMessage('popup_settings_pause_protection_temporarily', { count: PROTECTION_PAUSE_TIMEOUT_S })}
                    </button>
                    {/* TODO implement feature AG-6836 */}
                    <button
                        type="button"
                        className={styles.item}
                        disabled
                    >
                        {reactTranslator.getMessage('popup_settings_disable_site_temporarily', { count: PROTECTION_PAUSE_TIMEOUT_S })}
                    </button>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://reports.adguard.com/new_issue.html?product_version=${chrome.runtime.getManifest().version
                        }&url=${encodeURIComponent(currentUrl)
                        }&filters=${encodeURIComponent(enableFiltersIds.join('.'))
                        }&browser=Chrome&product_type=Ext`}
                        className={styles.item}
                    >
                        {reactTranslator.getMessage('popup_settings_report_issue')}
                    </a>
                </Tooltip>
            </fieldset>
        </div>
    );
});
