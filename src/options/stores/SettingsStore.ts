import {
    action,
    computed,
    flow,
    makeObservable,
    observable,
} from 'mobx';

import { Filter, CategoriesType } from 'Common/constants/common';
import { OPTION_SETTINGS_NAMES, SETTINGS_NAMES } from 'Common/constants/settings-constants';
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
    settings: OPTION_SETTINGS_NAMES = {
        [SETTINGS_NAMES.FILTERING_ENABLED]: false,
        [SETTINGS_NAMES.NOTICE_HIDDEN]: true,
    };

    @observable
    filters: Filter[] = [];

    @observable
    categories: CategoriesType = [];

    @action
    updateFilterState = (filterId: number, filterProps: Partial<Filter>) => {
        const filter = this.filters.find((f) => f.id === filterId);
        if (!filter) {
            throw new Error('filterId should be in the list of filters');
        }
        const idx = this.filters.indexOf(filter);
        this.filters[idx] = { ...filter, ...filterProps };
    };

    @action
    enableFilter = async (filterId: number) => {
        this.updateFilterState(filterId, { enabled: true });
        try {
            await sender.enableFilter(filterId);
        } catch (e: any) {
            log.debug(e.message);
            this.updateFilterState(filterId, { enabled: false });
        }
    };

    @action
    disableFilter = async (filterId: number) => {
        this.updateFilterState(filterId, { enabled: false });
        try {
            await sender.disableFilter(filterId);
        } catch (e: any) {
            log.debug(e.message);
            this.updateFilterState(filterId, { enabled: true });
        }
    };

    @action
    updateFilterTitle = async (filterId: number, filterTitle: string) => {
        this.updateFilterState(filterId, { title: filterTitle });
        try {
            await sender.updateFilterTitle(filterId, filterTitle);
            this.rootStore.customFilterModalStore.closeModal();
        } catch (e: any) {
            log.debug(e.message);
        }
    };

    getOptionsData = flow(function* getOptionsData(this: SettingsStore) {
        const { setLoader } = this.rootStore.uiStore;
        setLoader(true);
        const { settings, filters, categories } = yield sender.getOptionsData();
        this.settings = settings;
        this.filters = filters;
        this.categories = categories;
        setLoader(false);
    }).bind(this);

    setSetting = async (key: keyof OPTION_SETTINGS_NAMES, value: boolean) => {
        await sender.setSetting(key, value);
        this.updateSettingState(key, value);
    };

    @action
    updateSettingState = (key: keyof OPTION_SETTINGS_NAMES, value: boolean) => {
        this.settings[key] = value;
    };

    @computed
    get noticeHidden() {
        return this.settings[SETTINGS_NAMES.NOTICE_HIDDEN];
    }

    @computed
    get filteringEnabled() {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED] as boolean;
    }

    @flow* addCustomFilterByContent(filterContent: string, title: string, url: string) {
        try {
            this.filters = yield sender.addCustomFilterByContent(filterContent, title, url);
            this.rootStore.customFilterModalStore.closeModal();
        } catch (e: any) {
            log.error(e.message);
        }
    }

    @flow* removeCustomFilterById(filterId: number) {
        try {
            this.filters = yield sender.removeCustomFilterById(filterId);
            this.rootStore.customFilterModalStore.closeModal();
        } catch (e: any) {
            log.error(e.message);
        }
    }

    getFilterById = (filterId: number): Filter | null => {
        return this.filters.find((filter) => filter.id === filterId) || null;
    };
}
