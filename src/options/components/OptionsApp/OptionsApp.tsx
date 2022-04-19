import React, { useContext, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import { Icons } from 'Common/components/ui';
import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { createLongLivedConnection } from 'Common/messaging-utils';
import { Sidebar } from 'Options/components/Sidebar';
import { Notifications } from 'Options/components/Notifications';
import { About } from 'Options/components/About';
import { rootStore } from 'Options/stores';
import { Settings } from 'Options/components/Settings';
import { Filters } from 'Options/components/Filters';
import { UserRules } from 'Options/components/Filters/UserRules';
import { Languages } from 'Options/components/Languages';
import { Loader } from 'Options/components/Loader';

import styles from 'Options/components/OptionsApp/options-app.module.pcss';

export const OptionsApp = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore, optionsStore } = store;

    const getOptionsData = async () => {
        try {
            await settingsStore.getOptionsData();
        } catch (e) {
            log.error(e);
        }
    };

    useLayoutEffect(() => {
        getOptionsData();

        const events = [
            NOTIFIER_EVENTS.SETTING_UPDATED,
            NOTIFIER_EVENTS.ADD_RULES,
            NOTIFIER_EVENTS.SET_RULES,
        ];

        const messageHandler = (message: any) => {
            const { type, data: [data] } = message;

            switch (type) {
                case NOTIFIER_EVENTS.SETTING_UPDATED: {
                    const { key, value } = data;
                    settingsStore.updateSettingState(key, value);
                    break;
                }
                case NOTIFIER_EVENTS.ADD_RULES: {
                    optionsStore.updateCreatedUserRule(data);
                    optionsStore.addCreatedUserRule();
                    break;
                }
                case NOTIFIER_EVENTS.SET_RULES: {
                    optionsStore.setUserRules(data);
                    break;
                }
                default:
                    throw new Error(`Non supported event type: ${type}`);
            }
        };

        return createLongLivedConnection('options', events, messageHandler);
    }, []);

    return (
        <HashRouter hashType="noslash">
            <Icons />
            <div className={styles.section}>
                <Sidebar />
                <div className={styles.content}>
                    <div className={styles.inner}>
                        <Switch>
                            <Route path="/" exact component={Settings} />
                            <Route path="/about" component={About} />
                            <Route path="/userrules" component={UserRules} />
                            <Route path="/customfilters" component={Filters} />
                            <Route path="/languages" component={Languages} />
                            <Route />
                        </Switch>
                        <Notifications />
                        <Loader />
                    </div>
                </div>
            </div>
        </HashRouter>
    );
});
