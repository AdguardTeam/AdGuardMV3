import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { Icon, TooltipIcon, IconId } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { PROTECTION_PAUSE_TIMEOUT_S } from 'Common/constants/common';
import { REPORT_SITE_BASE } from 'Common/constants/urls';
import { getUrlWithQueryString } from 'Common/helpers';
import { prefs } from 'Common/prefs';

import { sender } from '../../messaging/sender';
import { rootStore } from '../../stores';

import styles from './Header.module.pcss';

export const Header = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        currentUrl,
        enableFiltersIds,
        protectionEnabled,
        pauseProtection,
        pauseProtectionWithTimeout,
    } = settingsStore;

    const openAssistant = async () => {
        await sender.openAssistant();
        window.close();
    };

    const openExtensionSettings = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await sender.openOptions();
        window.close();
    };

    const onPauseProtectionClick = async () => {
        await pauseProtection();
        await sender.reloadActiveTab();
    };

    const onPauseProtectionTimeoutClick = async () => {
        await pauseProtectionWithTimeout();
        await sender.reloadActiveTab();
    };

    const link = getUrlWithQueryString(REPORT_SITE_BASE, {
        from: 'popup', // param for tds
        product_version: chrome.runtime.getManifest().version,
        url: currentUrl,
        filters: enableFiltersIds.join('.'),
        browser: prefs.browser,
        product_type: 'Ext',
    });

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
                    onClick={openAssistant}
                    title={translator.getMessage('options_block_ads_on_website')}
                    disabled={!protectionEnabled}
                >
                    <Icon id={IconId.START} />
                </button>
                <button
                    className={styles.popupHeaderButton}
                    type="button"
                    onClick={openExtensionSettings}
                    title={translator.getMessage('options_open_settings')}
                    disabled={!protectionEnabled}
                >
                    <Icon id={IconId.SETTINGS} />
                </button>
                <TooltipIcon
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
                        {
                            reactTranslator.getMessage(
                                'popup_settings_pause_protection_temporarily',
                                { count: PROTECTION_PAUSE_TIMEOUT_S },
                            )
                        }
                    </button>
                    {/* TODO implement feature AG-6836 */}
                    <button
                        type="button"
                        className={styles.item}
                        disabled
                    >
                        {
                            reactTranslator.getMessage(
                                'popup_settings_disable_site_temporarily',
                                { count: PROTECTION_PAUSE_TIMEOUT_S },
                            )
                        }
                    </button>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href={link}
                        className={styles.item}
                    >
                        {reactTranslator.getMessage('popup_settings_report_issue')}
                    </a>
                </TooltipIcon>
            </fieldset>
        </div>
    );
});
