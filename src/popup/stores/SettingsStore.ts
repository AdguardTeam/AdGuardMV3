import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import { log } from 'Common/logger';
import { getActiveTab, getUrlDetails } from 'Common/helpers';
import type { RootStore } from './RootStore';
import { sender } from '../messaging/sender';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    popupDataReady = false;

    @observable
    filteringEnabled = false;

    @observable
    currentUrl: string = '';

    @action
    getCurrentTabUrl = async () => {
        const activeTab = await getActiveTab();
        runInAction(() => {
            this.currentUrl = activeTab.url || '';
        });
    };

    @computed
    get currentSite() {
        const urlDetails = getUrlDetails(this.currentUrl);
        if (urlDetails?.domainName) {
            return urlDetails.domainName;
        }
        return this.currentUrl;
    }

    @action
    toggleFilteringEnabled = async (filteringEnabled: boolean) => {
        try {
            await sender.setFilteringEnabled(filteringEnabled);
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.filteringEnabled = filteringEnabled;
        });
    };

    @action
    setFilteringEnabled = async (filteringEnabled: boolean) => {
        this.filteringEnabled = filteringEnabled;
    };

    @action
    getPopupData = async () => {
        const {
            filteringEnabled, wizardEnabled,
        } = await sender.getPopupData();

        runInAction(() => {
            this.popupDataReady = true;
            this.filteringEnabled = filteringEnabled;
            this.rootStore.wizardStore.setWizardEnabled(wizardEnabled);
        });
    };
}
