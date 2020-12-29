import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from '../../stores';
import { translate } from '../../../common/helpers';
import { getMessageReceiver } from '../../messaging/receiver';

import './index.pcss';

export const App = observer(() => {
    const store = useContext(rootStore);
    const { protectionEnabled, setProtectionEnabled, getProtectionEnabled } = store.settingsStore;

    const onChange = async (e) => {
        await setProtectionEnabled(e.target.checked);
    };

    useEffect(() => {
        (async () => {
            await getProtectionEnabled();
        })();

        const messageHandler = getMessageReceiver(store);

        chrome.runtime.onMessage.addListener(messageHandler);
        return () => chrome.runtime.onMessage.removeListener(messageHandler);
    }, []);

    const id = 'protection_status';

    return (
        <div>
            <h1 className="h--1">{translate('name')}</h1>
            <input
                type="checkbox"
                id={id}
                checked={protectionEnabled}
                onChange={onChange}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor={id} />
        </div>
    );
});
