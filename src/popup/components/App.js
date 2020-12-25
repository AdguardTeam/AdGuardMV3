import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from '../stores';
import { PROTECTION_ENABLED_KEY } from '../../common/constants';
import { translate } from '../../common/helpers';
import { sender } from '../messaging/sender';
import { getMessageReceiver } from '../messaging/receiver';
import { log } from '../../common/logger';
import './index.pcss';

export const App = observer(() => {
    const store = useContext(rootStore);
    const { protectionEnabled, setProtectionEnabled } = store.settingsStore;

    const onChange = async (e) => {
        const { checked } = e.target;

        try {
            const response = await sender.setProtectionEnabled(checked);
            setProtectionEnabled(response[PROTECTION_ENABLED_KEY]);
        } catch (err) {
            log.error(err);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await sender.getProtectionEnabled();
                setProtectionEnabled(response[PROTECTION_ENABLED_KEY]);
            } catch (err) {
                log.error(err);
            }
        })();

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
