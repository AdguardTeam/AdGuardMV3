import React, { useContext, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icons } from 'Common/components/ui';
import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { createLongLivedConnection } from 'Common/messaging-utils';

import { rootStore } from '../../stores';
import { Header } from '../Header';
import { Switcher } from '../Switcher';
import { PageInfo } from '../PageInfo';
import { Footer } from '../Footer';
import { Wizard } from '../Wizard';
import { Loader as InitialLoader } from '../Loader';
import { LoaderOverlay } from '../LoaderOverlay';
import { DisabledProtectionScreen } from './DisabledProtectionScreen';

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
            NOTIFIER_EVENTS.SETTING_UPDATED,
        ];

        const messageHandler = (message: any) => {
            const { type, data: [data] } = message;

            switch (type) {
                case NOTIFIER_EVENTS.SETTING_UPDATED: {
                    const { key, value } = data;
                    settingsStore.updateSettingState(key, value);
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

    const className = cn(styles.main, {
        [styles.mainDisabled]: !filteringEnabled,
        [styles.mainPaused]: !protectionEnabled,
    });

    return (
        <div className={styles.popup}>
            <Icons />
            {!protectionEnabled && <div className={styles.overlay} />}
            <Header />
            <main className={className}>
                {protectionEnabled
                    ? (
                        <>
                            <PageInfo />
                            <Switcher />
                            {/* TODO count blocked on the page */}
                            {/* <Action /> */}
                        </>
                    )
                    : (
                        <DisabledProtectionScreen />
                    )}
            </main>
            <Footer />
            <LoaderOverlay />
        </div>
    );
});
