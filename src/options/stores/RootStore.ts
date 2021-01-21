import { SettingsStore } from './SettingsStore';

export class RootStore {
    public settingsStore: SettingsStore;

    constructor() {
        this.settingsStore = new SettingsStore(this);
    }
}
