import {
    action,
    observable,
    makeObservable,
} from 'mobx';

export class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable protectionEnabled = false;

    @action
    setProtectionEnabled = (protectionEnabled) => {
        this.protectionEnabled = protectionEnabled;
    }
}
