import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import { Icons } from 'Common/components/ui/Icons';
import { log } from 'Common/logger';
import { getMessageReceiver } from '../../messaging/receiver';
import { Sidebar } from '../Sidebar';
import { About } from '../About';
import { rootStore } from '../../stores';
import { Settings } from '../Settings';

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

        const messageHandler = getMessageReceiver(store);

        chrome.runtime.onMessage.addListener(messageHandler);
        return () => chrome.runtime.onMessage.removeListener(messageHandler);
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
