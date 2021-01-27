import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import { log } from 'Common/logger';
import { getActiveTab, getUrlDetails } from 'Common/helpers';
import { sender } from '../messaging/sender';
import type { RootStore } from './RootStore';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable protectionEnabled: boolean = false;

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
    toggleProtectionEnabled = async (protectionEnabled: boolean) => {
        try {
            await sender.setProtectionEnabled(protectionEnabled);
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.protectionEnabled = protectionEnabled;
        });
    };

    @action
    setProtectionEnabled = async (protectionEnabled: boolean) => {
        this.protectionEnabled = protectionEnabled;
    };

    @action
    getProtectionEnabled = async () => {
        let isProtectionEnabled = this.protectionEnabled;

        try {
            isProtectionEnabled = await sender.getProtectionEnabled() as boolean;
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.protectionEnabled = isProtectionEnabled;
        });
    };
}
