import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import { log } from 'Common/logger';
import { getActiveTab, getUrlDetails } from 'Common/helpers';
import {
    DEFAULT_SETTINGS,
    SETTINGS_NAMES,
    SettingsType,
} from 'Common/settings-constants';
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
    currentUrl: string = '';

    @observable
    settings: SettingsType = DEFAULT_SETTINGS;

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

    setSetting = async (key: SETTINGS_NAMES, value: boolean) => {
        try {
            await sender.setSetting(key, value);
        } catch (e) {
            log.error(e);
            return;
        }

        this.updateSettingState(key, value);
    };

    @action
    updateSettingState = (key: SETTINGS_NAMES, value: boolean) => {
        this.settings[key] = value;
    };

    @action
    getPopupData = async () => {
        await this.getCurrentTabUrl();

        const {
            settings,
        } = await sender.getPopupData();

        runInAction(() => {
            this.popupDataReady = true;
            this.settings = settings;
        });
    };

    @computed
    get filteringEnabled() {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED];
    }

    @computed
    get wizardEnabled() {
        return this.settings[SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED];
    }
}
