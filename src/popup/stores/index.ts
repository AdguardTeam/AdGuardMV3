import { createContext } from 'react';
import { configure } from 'mobx';

import { MILLISECONDS_IN_SECOND } from 'Common/constants';
import { RootStore } from './RootStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

const store = new RootStore();
// TODO update current time only on protection pause
window.setInterval(async () => {
    store.settingsStore.updateCurrentTime();
}, MILLISECONDS_IN_SECOND);

export const rootStore = createContext(store);
