import { SettingsStore } from './SettingsStore';
import { SearchStore } from './SearchStore';
import { CustomFilterModalStore } from './CustomFilterModalStore';

export class RootStore {
    public settingsStore: SettingsStore;

    public searchStore: SearchStore;

    public customFilterModalStore: CustomFilterModalStore;

    constructor() {
        this.settingsStore = new SettingsStore(this);
        this.searchStore = new SearchStore(this);
        this.customFilterModalStore = new CustomFilterModalStore(this);
    }
}
