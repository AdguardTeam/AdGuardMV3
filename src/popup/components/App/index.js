import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from '../../stores';
import { getMessageReceiver } from '../../messaging/receiver';
import { Icons } from '../ui/Icons';
import { Header } from '../Header';

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
        <div className="popup">
            <Icons />
            <Header />
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
