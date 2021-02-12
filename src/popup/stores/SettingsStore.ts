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
    currentTime = 0;

    getCurrentTabUrl = async () => {
        const activeTab = await tabUtils.getActiveTab();
        runInAction(() => {
            this.currentUrl = activeTab.url || '';
        });
    };

    @computed
    get protectionPauseExpires() {
        // TODO updateCurrentTime here?
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

    @action
    setProtectionPausedTimerId = (protectionPausedTimerId: number) => {
        this.protectionPausedTimerId = protectionPausedTimerId;
    };

    @action
    updateSettingState = (key: SETTINGS_NAMES, value: SettingsValueType) => {
        this.settings[key] = value;
    };

    @action
    getPopupData = async () => {
        await this.getCurrentTabUrl();

        const { settings } = await sender.getPopupData();

        runInAction(() => {
            this.popupDataReady = true;
            this.settings = settings;

            if (settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES] > Date.now()) {
                this.setProtectionPausedTimer();
            }
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
