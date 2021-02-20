import {
    action,
    observable,
    makeObservable,
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

    protectionPausedTimerId = 0;

    @observable
    currentTime = 0;

    @observable
    refreshToEnableProtectionNeeded = false;

    @action
    setRefreshToEnableProtectionNeeded = (refreshToEnableProtectionNeeded: boolean) => {
        this.refreshToEnableProtectionNeeded = refreshToEnableProtectionNeeded;
    };

    @action
    getCurrentTabUrl = async () => {
        const activeTab = await tabUtils.getActiveTab();
        this.currentUrl = activeTab.url || '';
    };

    @computed
    get protectionPauseExpires() {
        return this.settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES] as number;
    }

    @computed
    get protectionPausedTimer() {
        return Math.ceil((this.protectionPauseExpires - this.currentTime) / 1000);
    }

    @computed
    get protectionPaused() {
        return !!this.currentTime && this.protectionPausedTimer > 0;
    }

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

    setProtectionPausedTimerId = (protectionPausedTimerId: number) => {
        this.protectionPausedTimerId = protectionPausedTimerId;
    };

    @action
    updateSettingState = (key: SETTINGS_NAMES, value: SettingsValueType) => {
        this.settings[key] = value;
    };

    @action
    setSettings = (settings: SettingsType) => {
        this.settings = settings;
    };

    @action
    setPopupDataReady = (popupDataReady: boolean) => {
        this.popupDataReady = popupDataReady;
    };

    @action
    getPopupData = async () => {
        await this.getCurrentTabUrl();

        const { settings } = await sender.getPopupData();

        this.setPopupDataReady(true);
        this.setSettings(settings);

        if (this.protectionPauseExpires > Date.now()) {
            this.setProtectionPausedTimer();
        }
    };

    @computed
    get filteringEnabled() {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED] as boolean;
    }

    @computed
    get wizardEnabled() {
        return this.settings[SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED];
    }

    @computed
    get protectionEnabled() {
        return this.settings[SETTINGS_NAMES.PROTECTION_ENABLED] as boolean;
    }

    @action
    updateCurrentTime = () => {
        this.currentTime = Date.now();
    };

    @action
    setProtectionPausedTimer = () => {
        if (this.protectionPausedTimerId) {
            return;
        }

        this.updateCurrentTime();
        this.setProtectionPausedTimerId(window.setInterval(async () => {
            this.updateCurrentTime();
            if (!this.protectionPausedTimer) {
                await this.resetProtectionPausedTimeout();
            }
        }, 1000));
    };

    @action
    resetProtectionPausedTimeout = async () => {
        clearTimeout(this.protectionPausedTimerId);
        this.setProtectionPausedTimerId(0);
        this.updateCurrentTime();
        await this.setSetting(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES, 0);
        await this.setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, true);
    };
}
