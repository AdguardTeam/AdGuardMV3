import {
    action,
    observable,
    makeObservable,
    computed,
    runInAction,
} from 'mobx';

import { log } from 'Common/logger';
import { getUrlDetails, isHttpRequest } from 'Common/helpers';
import { MS_IN_SECOND } from 'Common/constants/common';
import { DEFAULT_SETTINGS, POPUP_SETTINGS, SETTINGS_NAMES } from 'Common/constants/settings-constants';
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
    settings: POPUP_SETTINGS = DEFAULT_SETTINGS;

    protectionPausedTimerId = 0;

    @observable
    refreshAfterResumeProtection = false;

    @observable
    currentTimeMs = Date.now();

    @observable
    isAllowlisted = false;

    @observable
    isWebSiteTab = true;

    @observable
    enableFiltersIds: number[] = [];

    @observable
    loader = false;

    @action
    getCurrentTabUrl = async () => {
        const activeTab = await tabUtils.getActiveTab();

        runInAction(() => {
            this.currentUrl = activeTab.url || '';
            this.isWebSiteTab = isHttpRequest(this.currentUrl);
        });
    };

    @computed
    get protectionPauseExpiresSec() {
        const expireMs = this.settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES] as number;

        return expireMs <= this.currentTimeMs
            ? 0
            : Math.ceil((expireMs - this.currentTimeMs) / MS_IN_SECOND);
    }

    @computed
    get currentSite() {
        const urlDetails = getUrlDetails(this.currentUrl);
        if (urlDetails?.domainName.includes(chrome.runtime.id)) {
            return this.currentUrl;
        }
        if (urlDetails?.domainName) {
            return urlDetails.domainName;
        }
        return this.currentUrl;
    }

    @action
    setProtectionValue = (value: boolean) => {
        this.settings[SETTINGS_NAMES.PROTECTION_ENABLED] = value;
    };

    @action
    setProtectionPauseExpiresValue = (protectionPauseExpiresMs: number) => {
        this.settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES] = protectionPauseExpiresMs;
        this.clearOrSetUpdateTime(protectionPauseExpiresMs);
    };

    @action
    clearOrSetUpdateTime = (protectionPauseExpiresMs: number) => {
        if (protectionPauseExpiresMs === 0) {
            clearInterval(this.protectionPausedTimerId);
        } else {
            this.refreshAfterResumeProtection = true;
            this.protectionPausedTimerId = window.setInterval(() => {
                runInAction(() => {
                    this.currentTimeMs = Date.now();
                });
            });
        }
    };

    @action
    refreshPage = async () => {
        this.setLoader(true);

        this.refreshAfterResumeProtection = false;
        await sender.reloadActiveTab();

        this.setLoader(false);
    };

    @action
    pauseProtection = async () => {
        this.setLoader(true);

        await sender.pauseProtection();
        this.setProtectionValue(false);

        this.setLoader(false);
    };

    @action
    pauseProtectionWithTimeout = async () => {
        this.setLoader(true);

        const protectionPauseExpiresMs = await sender.pauseProtectionWithTimeout();
        this.setProtectionValue(false);
        this.setProtectionPauseExpiresValue(protectionPauseExpiresMs);

        await sender.reloadActiveTab();

        this.setLoader(false);
    };

    @action
    resumeProtection = async () => {
        this.setLoader(true);

        try {
            await sender.enableProtection();
            this.setProtectionPauseExpiresValue(0);
            await this.refreshPage();
        } catch (e) {
            log.error(e);
            this.setLoader(false);
            return;
        }

        runInAction(() => {
            this.settings[SETTINGS_NAMES.PROTECTION_ENABLED] = true;
        });

        this.setLoader(false);
    };

    @action
    hideWizard = async () => {
        try {
            await sender.hideWizard();
        } catch (e) {
            log.error(e);
            return;
        }

        runInAction(() => {
            this.settings[SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED] = false;
        });
    };

    @action
    updatePopupData = async () => {
        await this.getCurrentTabUrl();

        const { settings, isAllowlisted, enableFiltersIds } = await sender.getPopupData(this.currentSite);

        runInAction(() => {
            this.settings = settings;
            this.isAllowlisted = isAllowlisted;
            this.enableFiltersIds = enableFiltersIds;
        });

        this.clearOrSetUpdateTime(this.settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES]);
    };

    @action
    getPopupData = async () => {
        runInAction(() => {
            this.popupDataReady = false;
        });

        await this.updatePopupData();

        runInAction(() => {
            this.popupDataReady = true;
        });
    };

    @computed
    get wizardEnabled() {
        return this.settings[SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED];
    }

    @computed
    get protectionEnabled() {
        return this.settings[SETTINGS_NAMES.PROTECTION_ENABLED] as boolean;
    }

    @action
    toggleAllowlisted = async () => {
        this.setLoader(true);

        const isAllowlisted = await sender.toggleSiteAllowlistStatus(this.currentSite);
        runInAction(() => {
            this.isAllowlisted = isAllowlisted;
        });

        this.setLoader(false);
    };

    @action
    setLoader = (value: boolean) => {
        this.loader = value;
    };
}
