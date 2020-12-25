import { createContext } from 'react';
import { configure } from 'mobx';
import { SettingsStore } from './settingsStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

class RootStore {
    constructor() {
        this.settingsStore = new SettingsStore(this);
    }
}

const StoreContext = createContext(new RootStore());

export const StoreConsumer = StoreContext.Consumer;
export const rootStore = StoreContext;
