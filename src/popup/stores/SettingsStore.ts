import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import { log } from 'Common/logger';
import { MESSAGE_TYPES, PopupData } from 'Common/constants';
import { sendMessage, getActiveTab, getUrlDetails } from 'Common/helpers';
import { sender } from '../messaging/sender';
import type { RootStore } from './RootStore';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    popupDataReady = false;

    @observable
    filteringEnabled= false;

    @observable
    currentUrl: string = '';

    @action
    getPopupInfo = async () => {
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
        const popupData = await sendMessage<PopupData>(MESSAGE_TYPES.GET_POPUP_DATA);
        runInAction(() => {
            this.popupDataReady = true;
            this.filteringEnabled = popupData.filteringEnabled;
            this.rootStore.wizardStore.setWizardEnabled(popupData.wizardEnabled);
        });
    };
}
