import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { rootStore } from '../../stores';
import { getMessageReceiver } from '../../messaging/receiver';
import { Icons } from '../ui/Icons';
import { Header } from '../Header';
import { Switcher } from '../Switcher';
import { PageInfo } from '../PageInfo';
import { Action } from '../Action';
import { Footer } from '../Footer';

import './index.pcss';

export const App = observer(() => {
    const store = useContext(rootStore);
    const { protectionEnabled, getProtectionEnabled } = store.settingsStore;

    useEffect(() => {
        (async () => {
            await getProtectionEnabled();
        })();

        const messageHandler = getMessageReceiver(store);

        chrome.runtime.onMessage.addListener(messageHandler);
        return () => chrome.runtime.onMessage.removeListener(messageHandler);
    }, []);

    const classname = cn('main', {
        'main--disabled': !protectionEnabled,
    });

    return (
        <div className="popup">
            <Icons />
            <Header />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <main className={classname}>
                <Switcher />
                <PageInfo />
                <Action />
            </main>
            <Footer />
        </div>
    );
});
