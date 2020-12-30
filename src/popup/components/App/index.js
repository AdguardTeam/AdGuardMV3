import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { rootStore } from '../../stores';
import { getMessageReceiver } from '../../messaging/receiver';
import { Icons } from '../../../common/components/ui/Icons';
import { Header } from '../Header';
import { Switcher } from '../Switcher';
import { PageInfo } from '../PageInfo';
import { Action } from '../Action';
import { Footer } from '../Footer';
import { Wizard } from '../WIzard';

import './index.pcss';

export const App = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore, wizardStore } = store;
    const { protectionEnabled, getProtectionEnabled } = settingsStore;
    const { displayWizard } = wizardStore;

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
            {displayWizard
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
