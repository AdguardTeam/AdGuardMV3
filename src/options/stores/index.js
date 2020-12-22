import { createContext } from 'react';
import { configure } from 'mobx';
import SettingsStore from './settingsStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

class RootStore {
    constructor() {
        this.settingsStore = new SettingsStore(this);
    }
}

const rootStore = new RootStore();

const StoreContext = createContext(rootStore);

export const StoreConsumer = StoreContext.Consumer;
export default StoreContext;
