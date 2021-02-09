import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import { log } from 'Common/logger';
import { getUrlDetails } from 'Common/helpers';
import {
    DEFAULT_SETTINGS,
    SETTINGS_NAMES,
    SettingsType,
    SettingsValueType,
} from 'Common/settings-constants';
import { tabUtils } from 'Common/tab-utils';
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
    currentUrl = '';

    @observable
    settings: SettingsType = DEFAULT_SETTINGS;

    @observable
    protectionPausedTimerId = 0;

    @observable
    protectionPausedTimeout = 0;

    getCurrentTabUrl = async () => {
        const activeTab = await tabUtils.getActiveTab();
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

    setSetting = async (key: SETTINGS_NAMES, value: SettingsValueType) => {
        try {
            await sender.setSetting(key, value);
        } catch (e) {
            log.error(e);
            return;
        }

        this.updateSettingState(key, value);
    };

    @action
    updateSettingState = (key: SETTINGS_NAMES, value: SettingsValueType) => {
        this.settings[key] = value;
    };

    @action
    getPopupData = async () => {
        await this.getCurrentTabUrl();

        const {
            settings,
        } = await sender.getPopupData();

        if (this.settings[SETTINGS_NAMES.GLOBAL_FILTERING_PAUSED_UNTIL] < Date.now()) {
            this.setProtectionPausedTimer();
        }

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

    @computed
    get protectionEnabled() {
        return this.settings[SETTINGS_NAMES.PROTECTION_ENABLED];
    }

    @computed
    get globalFilteringPausedUntil() {
        return this.settings[SETTINGS_NAMES.GLOBAL_FILTERING_PAUSED_UNTIL] as number;
    }

    @action
    setProtectionPausedTimer = () => {
        runInAction(() => {
            this.protectionPausedTimerId = window.setInterval(() => {
                runInAction(() => {
                    this.protectionPausedTimeout = Math.ceil(
                        (this.globalFilteringPausedUntil - Date.now()) / 1000,
                    );
                });

                if (this.protectionPausedTimeout <= 0) {
                    this.resetProtectionPausedTimeout();
                }
            }, 1000);
        });
    };

    @action
    resetProtectionPausedTimeout = () => {
        clearTimeout(this.protectionPausedTimerId);
        this.protectionPausedTimeout = 0;
    };
}
