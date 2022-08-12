import React, { useContext, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { Icons } from 'Common/components/ui';
import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { WithTimeout } from 'Common/components/WithTimeout';
import { useEventListener } from 'Common/hooks/useEventListener';

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

enum CONTENT_KEYS {
    LOADER,
    WIZARD,
    CONTENT,
}

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
        getPopupData();
    }, []);

    useEventListener('popup', {
        [NOTIFIER_EVENTS.SET_RULES]: async () => {
            await settingsStore.getPopupData();
        },
        [NOTIFIER_EVENTS.PROTECTION_UPDATED]: async (data: any) => {
            const { value } = data;
            await settingsStore.setProtection(value as boolean);
        },
        [NOTIFIER_EVENTS.PROTECTION_PAUSE_EXPIRES_UPDATED]: async (data: any) => {
            const { value } = data;
            await settingsStore.setProtectionPauseExpires(value as number);
        },
    });

    const isLimitsExceed = wasEnabledIds.length > 0;

    const mainContent = protectionEnabled
        ? (
            <>
                <PageInfo />
                <Switcher />
                {/* TODO count blocked on the page */}
                {/* <Action /> */}
            </>
        )
        : <DisabledProtectionScreen />;

    const footer = isLimitsExceed
        ? <LimitsExceed />
        : <Footer />;

    const getContentKey = (): CONTENT_KEYS => {
        if (!popupDataReady) {
            return CONTENT_KEYS.LOADER;
        }

        if (wizardEnabled) {
            return CONTENT_KEYS.WIZARD;
        }

        return CONTENT_KEYS.CONTENT;
    };

    const getContent = (key: CONTENT_KEYS): JSX.Element => {
        switch (key) {
            case CONTENT_KEYS.LOADER: {
                return (
                    <div className={styles.popup} key={CONTENT_KEYS.LOADER}>
                        {popupDataReady}
                        <Icons />
                        <InitialLoader />
                    </div>
                );
            }
            case CONTENT_KEYS.WIZARD: {
                return (
                    <div className={styles.popup} key={CONTENT_KEYS.WIZARD}>
                        <Icons />
                        <Wizard />
                    </div>
                );
            }
            case CONTENT_KEYS.CONTENT:
            default:
            {
                return (
                    <div className={styles.popup} key={CONTENT_KEYS.CONTENT}>
                        <Icons />
                        {!protectionEnabled && <div className={styles.overlay} />}
                        <Header />
                        <main className={styles.main}>{ mainContent }</main>
                        {footer}
                        <LoaderOverlay />
                    </div>
                );
            }
        }
    };

    const sectionKey = getContentKey();
    const section = getContent(sectionKey);

    return (
        <WithTimeout
            dummy={<div className={styles.popup} />}
            timeoutMS={600}
        >
            <SwitchTransition>
                <CSSTransition
                    timeout={300}
                    key={sectionKey}
                    in
                    appear
                    unmountOnExit
                    classNames="fade"
                >
                    { section }
                </CSSTransition>
            </SwitchTransition>
        </WithTimeout>
    );
});
