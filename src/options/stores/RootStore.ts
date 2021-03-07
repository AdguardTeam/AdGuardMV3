import { SettingsStore } from './SettingsStore';
import { SearchStore } from './SearchStore';

export class RootStore {
    public settingsStore: SettingsStore;

    public searchStore: SearchStore;

    constructor() {
        this.settingsStore = new SettingsStore(this);
        this.searchStore = new SearchStore(this);
    }
}
