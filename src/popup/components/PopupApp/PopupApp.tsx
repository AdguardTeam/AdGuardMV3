import React, { useContext, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';

import { Icons } from 'Common/components/ui';
import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { createLongLivedConnection } from 'Common/messaging-utils';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';

import { rootStore } from '../../stores';
import { Header } from '../Header';
import { Switcher } from '../Switcher';
import { PageInfo } from '../PageInfo';
import { Footer } from '../Footer';
import { Wizard } from '../Wizard';
import { Loader as InitialLoader } from '../Loader';
import { LoaderOverlay } from '../LoaderOverlay';
import { LimitsExceed } from '../LimitsExceed';

import { DisabledProtectionScreen } from './DisabledProtectionScreen';
import styles from './PopupApp.module.pcss';

export const PopupApp = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore } = store;
    const {
        getPopupData,
        popupDataReady,
        wizardEnabled,
        protectionEnabled,
        settings: {
            [SETTINGS_NAMES.FILTERS_CHANGED]: wasEnabledIds,
        },
    } = settingsStore;

    useLayoutEffect(() => {
        (async () => {
            try {
                await getPopupData();
            } catch (e) {
                log.error(e);
            }
        })();

        const events = [
            NOTIFIER_EVENTS.SET_RULES,
            NOTIFIER_EVENTS.PROTECTION_UPDATED,
            NOTIFIER_EVENTS.PROTECTION_PAUSE_EXPIRES_UPDATED,
        ];

        const messageHandler = async (message: any) => {
            const { type, data: [data] } = message;

            switch (type) {
                // Actually, this event doesn't need, because if rules changed
                // - popup will lost focus and will be closed
                // And after opened - it will requests rules again
                case NOTIFIER_EVENTS.SET_RULES: {
                    await settingsStore.getPopupData();
                    break;
                }

                case NOTIFIER_EVENTS.PROTECTION_UPDATED: {
                    const { value } = data;
                    await settingsStore.setProtection(value as boolean);
                    break;
                }

                case NOTIFIER_EVENTS.PROTECTION_PAUSE_EXPIRES_UPDATED: {
                    const { value } = data;
                    await settingsStore.setProtectionPauseExpires(value as number);
                    break;
                }

                default: {
                    throw new Error(`Non supported event type: ${type}`);
                }
            }
        };

        return createLongLivedConnection('popup', events, messageHandler);
    }, []);

    if (!popupDataReady) {
        return (
            <div className={styles.popup}>
                <Icons />
                <InitialLoader />
            </div>
        );
    }

    if (wizardEnabled) {
        return (
            <div className={styles.popup}>
                <Icons />
                <Wizard />
            </div>
        );
    }

    const isLimitsExceed = wasEnabledIds.length > 0;

    return (
        <div className={styles.popup}>
            <Icons />
            {!protectionEnabled && <div className={styles.overlay} />}
            <Header />
            <main className={styles.main}>
                {
                    protectionEnabled
                        ? (
                            <>
                                <PageInfo />
                                <Switcher />
                                {/* TODO count blocked on the page */}
                                {/* <Action /> */}
                            </>
                        )
                        : <DisabledProtectionScreen />
                }
            </main>
            {
                isLimitsExceed
                    ? <LimitsExceed />
                    : <Footer />
            }
            <LoaderOverlay />
        </div>
    );
});
