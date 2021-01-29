import {
    action,
    observable,
    makeObservable,
} from 'mobx';

import { log } from 'Common/logger';
import type { RootStore } from './RootStore';
import { sender } from '../messaging/sender';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable filteringEnabled = false;

    @observable noticeHidden = true;

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
    setNoticeHidden = (noticeHidden: boolean) => {
        this.noticeHidden = noticeHidden;
    };

    @action
    getOptionsData = async () => {
        const {
            noticeHidden,
            filteringEnabled,
        } = await sender.getOptionsData();

        this.setFilteringEnabled(filteringEnabled);
        this.setNoticeHidden(noticeHidden);
    };
}
