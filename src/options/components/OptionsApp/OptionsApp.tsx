import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import { Icons } from 'Common/components/ui/Icons';
import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { Sidebar } from '../Sidebar';
import { About } from '../About';
import { rootStore } from '../../stores';
import { Settings } from '../Settings';
import { createLongLivedConnection } from '../../messaging/receiver';

import './options-app.pcss';

export const OptionsApp = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore } = store;
    const { getOptionsData } = settingsStore;

    useEffect(() => {
        (async () => {
            try {
                await getOptionsData();
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

        return createLongLivedConnection(events, messageHandler);
    }, []);

    return (
        <HashRouter hashType="noslash">
            <Icons />
            <div className="section">
                <Sidebar />
                <div className="content">
                    <Switch>
                        <Route path="/" exact component={Settings} />
                        <Route path="/about" component={About} />
                        <Route />
                    </Switch>
                </div>
            </div>
        </HashRouter>
    );
});
