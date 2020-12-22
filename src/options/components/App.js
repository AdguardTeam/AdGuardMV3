/* global chrome */
import * as React from 'react';
import { observer } from 'mobx-react';
import rootStore from '../stores';
import { PROTECTION_ENABLED_KEY } from '../../common/constants';
import { translate } from '../../common/helpers';
import sender from '../messaging/sender';
import getMessageReceiver from '../messaging/reciever';
import './index.pcss';

const App = observer(() => {
    const store = React.useContext(rootStore);
    const { protectionEnabled, setProtectionEnabled } = store.settingsStore;

    const onChange = (e) => {
        const { checked } = e.target;

        sender.setProtectionEnabled(checked, (response) => {
            setProtectionEnabled(response[PROTECTION_ENABLED_KEY]);
        });
    };

    React.useEffect(() => {
        sender.getProtectionEnabled((response) => {
            const { data } = response;
            setProtectionEnabled(data[PROTECTION_ENABLED_KEY]);
        });

        const messageHandler = getMessageReceiver(store);

        chrome.runtime.onMessage.addListener(messageHandler);
        return () => chrome.runtime.onMessage.removeListener(messageHandler);
    }, []);

    return (
        <div>
            <h1 className="h--1">{translate('name')}</h1>
            <input
                type="checkbox"
                id="protection_status"
                checked={protectionEnabled}
                onChange={onChange}
            />
            <label htmlFor="protection_status" />
        </div>
    );
});

export default App;
