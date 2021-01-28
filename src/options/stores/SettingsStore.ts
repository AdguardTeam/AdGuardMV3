import {
    action,
    observable,
    makeObservable,
    runInAction,
} from 'mobx';

import { log } from 'Common/logger';
import { sender } from '../messaging/sender';
import type { RootStore } from './RootStore';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable filteringEnabled = false;

    @action
    toggleFilteringEnabled = async (filteringEnabled: boolean) => {
        try {
            await sender.setFilteringEnabled(filteringEnabled);
        } catch (err) {
            log.error(err);
            return;
        }

        this.setFilteringEnabled(filteringEnabled);
    };

    @action
    setFilteringEnabled = (filteringEnabled: boolean) => {
        this.filteringEnabled = filteringEnabled;
    };

    @action
    getFilteringEnabled = async () => {
        let isFilteringEnabled = this.filteringEnabled;

        try {
            isFilteringEnabled = await sender.getFilteringEnabled();
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.filteringEnabled = isFilteringEnabled;
        });
    };
}
