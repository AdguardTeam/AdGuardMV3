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
import { MILLISECONDS_IN_SECOND, PROTECTION_PAUSE_TIMEOUT_TICK_MS } from 'Common/constants';
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
    currentTime = Date.now();

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
    get protectionPauseExpired() {
        return this.protectionPauseExpires !== 0 && this.protectionPauseExpires <= this.currentTime;
    }

    @computed
    get protectionPausedTimer() {
        return this.protectionPauseExpired
            ? 0
            : Math.ceil((this.protectionPauseExpires - this.currentTime) / MILLISECONDS_IN_SECOND);
    }

    @computed
    get protectionPaused() {
        return this.protectionPausedTimer > 0;
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

        if (this.protectionPaused) {
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

        this.setProtectionPausedTimerId(window.setInterval(async () => {
            if (!this.protectionPaused) {
                await this.resetProtectionPausedTimeout();
            }
        }, PROTECTION_PAUSE_TIMEOUT_TICK_MS));
    };

    @action
    resetProtectionPausedTimeout = async () => {
        clearTimeout(this.protectionPausedTimerId);
        this.setProtectionPausedTimerId(0);
        await this.setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, true);
    };
}
