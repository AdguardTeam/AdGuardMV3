import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icons } from 'Common/components/ui/Icons';
import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { createLongLivedConnection } from 'Common/messaging-utils';
import { Icon } from 'Common/components/ui/Icon';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { theme } from 'Common/styles';
import { rootStore } from '../../stores';
import { Header } from '../Header';
import { Switcher } from '../Switcher';
import { PageInfo } from '../PageInfo';
import { Action } from '../Action';
import { Footer } from '../Footer';
import { Wizard } from '../Wizard';

import styles from './PopupApp.module.pcss';

export const PopupApp = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore } = store;
    const {
        filteringEnabled,
        getPopupData,
        popupDataReady,
        wizardEnabled,
        protectionEnabled,
        setSetting,
        protectionPausedTimeout,
        setProtectionPausedTimer,
        resetProtectionPausedTimeout,
    } = settingsStore;

    useEffect(() => {
        (async () => {
            try {
                await getPopupData();
            } catch (e) {
                log.error(e);
            }
        })();

        const events = [
            NOTIFIER_EVENTS.SETTING_UPDATED,
        ];

        const messageHandler = (message: any) => {
            const { type, data: [data] } = message;

            switch (type) {
                case NOTIFIER_EVENTS.SETTING_UPDATED: {
                    const { key, value } = data;
                    settingsStore.updateSettingState(key, value);
                    if (key === SETTINGS_NAMES.GLOBAL_FILTERING_PAUSED_UNTIL
                        && value > Date.now()) {
                        setProtectionPausedTimer();
                    }
                    break;
                }
                default:
                    throw new Error(`Non supported event type: ${type}`);
            }
        };

        return createLongLivedConnection('popup', events, messageHandler);
    }, []);

    const className = cn(styles.main, {
        [styles.mainDisabled]: !filteringEnabled,
        [styles.mainPaused]: !protectionEnabled,
    });

    if (!popupDataReady) {
        return <div className={styles.popup} />;
    }

    const onEnableProtectionClick = async () => {
        await setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, true);
        resetProtectionPausedTimeout();
    };

    return (
        <div className={styles.popup}>
            <Icons />
            {wizardEnabled
                ? <Wizard />
                : (
                    <>
                        <Header />
                        <main className={className}>
                            {protectionEnabled && protectionPausedTimeout <= 0
                                ? (
                                    <>
                                        <Switcher />
                                        <PageInfo />
                                        <Action />
                                    </>
                                )
                                : (
                                    <>
                                        <div><Icon id="disabled-logo" className={styles.logo} /></div>
                                        <section className={styles.section}>
                                            <h1 className={cn(theme.common.pageInfoMain, styles.pageInfoMain)}>{reactTranslator.getMessage('popup_protection_is_paused')}</h1>
                                            {protectionPausedTimeout > 0 && (
                                                <h6 className={theme.common.pageInfoAdditional}>
                                                    {reactTranslator.getMessage('popup_protection_will_be_resumed_after_x_sec', { count: protectionPausedTimeout })}
                                                </h6>
                                            )}
                                        </section>
                                        <button type="button" className={`${styles.buttonGreen} action-button`} onClick={onEnableProtectionClick}>
                                            {reactTranslator.getMessage('popup_protection_resume_now')}
                                        </button>
                                    </>
                                )}
                        </main>
                        <Footer />
                    </>
                )}
        </div>
    );
});
