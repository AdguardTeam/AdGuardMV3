import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Route, Switch, HashRouter } from 'react-router-dom';

import { Checkbox } from '../../../common/components/Checkbox';
import { Icon } from '../../../common/components/ui/Icon';
import { Icons } from '../../../common/components/ui/Icons';
import { getMessageReceiver } from '../../messaging/receiver';
import { Sidebar } from '../Sidebar';
import { rootStore } from '../../stores';
import { reactTranslator } from '../../../common/translators/reactTranslator';

import './options-app.pcss';

export const OptionsApp = observer(() => {
    const rootStoreContext = useContext(rootStore);
    const { settingsStore } = rootStoreContext;
    const { protectionEnabled, setProtectionEnabled, getProtectionEnabled } = settingsStore;

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await setProtectionEnabled(e.target.checked);
    };

    const OPTIONS_MAP = [
        {
            iconId: 'option_1',
            optionName: 'ad_blocking',
            renderControl: ({
                optionName,
            }) => <Checkbox id={optionName} checked={protectionEnabled} onChange={onChange} />,
        },
        {
            iconId: 'option_2',
            optionName: 'miscellaneous',
            renderControl: Checkbox,
        },
        {
            iconId: 'option_3',
            optionName: 'trackers_blocking',
            renderControl: Checkbox,
        },
        {
            iconId: 'option_4',
            optionName: 'languages',
            renderControl: () => <Icon className="icon--option" id="arrow" />,
        },
        {
            iconId: 'option_5',
            optionName: 'filters',
            renderControl: () => <Icon className="icon--option" id="arrow" />,
        },
        {
            iconId: 'option_6',
            optionName: 'user_rules',
            renderControl: () => <Icon className="icon--option" id="arrow" />,
        },
    ];

    useEffect(() => {
        (async () => {
            await getProtectionEnabled();
        })();

        const messageHandler = getMessageReceiver(rootStoreContext);

        chrome.runtime.onMessage.addListener(messageHandler);
        return () => chrome.runtime.onMessage.removeListener(messageHandler);
    }, []);

    const Settings = () => (
        <>
            <h1 className="h1">
                {reactTranslator.getMessage('options_settings_title')}
            </h1>
            <div className="option__container">
                {OPTIONS_MAP.map((option) => {
                    const { iconId, optionName, renderControl } = option;

                    return (
                        <div key={optionName} className="option__item">
                            <Icon id={iconId} className="icon--option" />
                            <label
                                htmlFor={iconId}
                                className="option__label"
                            >
                                {reactTranslator.getMessage(optionName)}
                            </label>
                            {renderControl(option)}
                        </div>
                    );
                })}
            </div>
        </>
    );

    return (
        <HashRouter hashType="noslash">
            <Icons />
            <div className="section">
                <Sidebar />
                <div className="content">
                    <Switch>
                        <Route path="/" exact component={Settings} />
                        <Route path="/about" component={() => <h2>About</h2>} />
                        <Route />
                    </Switch>
                </div>
            </div>
        </HashRouter>
    );
});
