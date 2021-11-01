import { SettingsStore } from './SettingsStore';
import { OptionsStore } from './OptionsStore';
import { SearchStore } from './SearchStore';
import { UiStore } from './UiStore';
import { CustomFilterModalStore } from './CustomFilterModalStore';

export class RootStore {
    public uiStore: UiStore;

    public settingsStore: SettingsStore;

    public optionsStore: OptionsStore;

    public searchStore: SearchStore;

    public customFilterModalStore: CustomFilterModalStore;

    constructor() {
        this.uiStore = new UiStore(this);
        this.settingsStore = new SettingsStore(this);
        this.optionsStore = new OptionsStore(this);
        this.searchStore = new SearchStore(this);
        this.customFilterModalStore = new CustomFilterModalStore(this);
    }
}
