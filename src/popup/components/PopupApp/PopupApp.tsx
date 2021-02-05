import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icons } from 'Common/components/ui/Icons';
import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { createLongLivedConnection } from 'Common/messaging-utils';
import { rootStore } from '../../stores';
import { Header } from '../Header';
import { Switcher } from '../Switcher';
import { PageInfo } from '../PageInfo';
import { Action } from '../Action';
import { Footer } from '../Footer';
import { Wizard } from '../Wizard';

import './popup-app.pcss';

export const PopupApp = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore } = store;
    const {
        filteringEnabled,
        getPopupData,
        popupDataReady,
        wizardEnabled,
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
                    break;
                }
                default:
                    throw new Error(`Non supported event type: ${type}`);
            }
        };

        return createLongLivedConnection('popup', events, messageHandler);
    }, []);

    const classname = cn('main', {
        'main--disabled': !filteringEnabled,
    });

    if (!popupDataReady) {
        return <div className="popup" />;
    }

    return (
        <div className="popup">
            <Icons />
            {wizardEnabled
                ? <Wizard />
                : (
                    <>
                        <Header />
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <main className={classname}>
                            <Switcher />
                            <PageInfo />
                            <Action />
                        </main>
                        <Footer />
                    </>
                )}
        </div>
    );
});
