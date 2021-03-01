import { action, computed, flow, makeObservable, observable, } from 'mobx';

import { DEFAULT_SETTINGS, SETTINGS_NAMES } from 'Common/settings-constants';
import { log } from 'Common/logger';
import type { RootStore } from './RootStore';
import { sender } from '../messaging/sender';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    settings = DEFAULT_SETTINGS;

    @observable
    filters: Filter[] = [];

    // FIXME set by default to false
    @observable
    isCustomFilterModalOpen: boolean = true;

    @observable
    filterIdInCustomModal: number | null = null;

    @action
    updateFilterState = (filterId: number, filterProps: Partial<Filter>) => {
        const filter = this.filters.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error('filterId should be in the list of filters');
        }
        const idx = this.filters.indexOf(filter);
        const updatedFilter = { ...filter, ...filterProps };
        this.filters.splice(idx, 1, updatedFilter);
    };

    @action
    enableFilter = async (filterId: number) => {
        this.updateFilterState(filterId, { enabled: true });
        try {
            await sender.enableFilter(filterId);
        } catch (e) {
            log.debug(e.message);
            this.updateFilterState(filterId, { enabled: false });
        }
    };

    @action
    disableFilter = async (filterId: number) => {
        this.updateFilterState(filterId, { enabled: false });
        try {
            await sender.disableFilter(filterId);
        } catch (e) {
            log.debug(e.message);
            this.updateFilterState(filterId, { enabled: true });
        }
    };

    getOptionsData = flow(function* getOptionsData(this: SettingsStore) {
        const { settings, filters } = yield sender.getOptionsData();
        this.settings = settings;
        this.filters = filters;
    }).bind(this);

    setSetting = async (key: SETTINGS_NAMES, value: boolean) => {
        await sender.setSetting(key, value);
        this.updateSettingState(key, value);
    };

    @action
    updateSettingState = (key: SETTINGS_NAMES, value: boolean) => {
        this.settings[key] = value;
    };

    @computed
    get noticeHidden() {
        return this.settings[SETTINGS_NAMES.NOTICE_HIDDEN];
    }

    @computed
    get filteringEnabled() {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED];
    }

    @flow* addCustomFilterByContent(filterContent: string, title: string) {
        try {
            this.filters = yield sender.addCustomFilterByContent(filterContent, title);
        } catch (e) {
            log.error(e.message);
        }
    }

    @action
    openCustomFilterModal = (filterId?: number) => {
        this.isCustomFilterModalOpen = true;
        if (filterId) {
            this.filterIdInCustomModal = filterId;
        }
    };

    @action
    closeCustomFilterModal = () => {
        this.isCustomFilterModalOpen = false;
        this.filterIdInCustomModal = null;
    };
}
