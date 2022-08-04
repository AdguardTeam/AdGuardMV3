import {
    action,
    observable,
    makeObservable,
    computed,
    runInAction,
} from 'mobx';

import { log } from 'Common/logger';
import { getUrlDetails, isHttpRequest } from 'Common/helpers';
import { UserRuleType, MS_IN_SECOND, PROTECTION_PAUSE_TIMEOUT_TICK_MS } from 'Common/constants/common';
import { DEFAULT_SETTINGS, POPUP_SETTINGS, SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { tabUtils } from 'Common/tab-utils';
import { UserRulesData, UserRulesProcessor } from 'Options/user-rules-processor';

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
    currentTime = Date.now();

    @observable
    isAllowlisted = false;

    @observable
    applicationAvailable = true;

    @observable
    enableFiltersIds: number[] = [];

    currentAllowRule: UserRulesData | undefined;

    userRules = '';

    @observable
    loader = false;

    @action
    getCurrentTabUrl = async () => {
        const activeTab = await tabUtils.getActiveTab();

        runInAction(() => {
            this.currentUrl = activeTab.url || '';
            this.applicationAvailable = !!isHttpRequest(this.currentUrl);
        });
    };

    @computed
    get protectionPauseExpires() {
        return this.settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES] as number;
    }

    @computed
    get protectionPauseExpired() {
        return this.protectionPauseExpires <= this.currentTime;
    }

    @computed
    get protectionPausedTimer() {
        return this.protectionPauseExpired
            ? 0
            : Math.ceil((this.protectionPauseExpires - this.currentTime) / MS_IN_SECOND);
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

    @action
    setProtection = async (value: boolean) => {
        try {
            await sender.setSetting({ [SETTINGS_NAMES.PROTECTION_ENABLED]: value });
        } catch (e) {
            log.error(e);
            return;
        }

        runInAction(() => {
            this.settings[SETTINGS_NAMES.PROTECTION_ENABLED] = value;
        });
    };

    @action
    setProtectionPauseExpires = async (value: number) => {
        try {
            await sender.setSetting({ [SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES]: value });
        } catch (e) {
            log.error(e);
            return;
        }

        runInAction(() => {
            this.settings[SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES] = value;
        });
    };

    @action
    setWizardEnabled = async (value: boolean) => {
        try {
            await sender.setSetting({ [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: value });
        } catch (e) {
            log.error(e);
            return;
        }

        runInAction(() => {
            this.settings[SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED] = value;
        });
    };

    setProtectionPausedTimerId = (protectionPausedTimerId: number) => {
        this.protectionPausedTimerId = protectionPausedTimerId;
    };

    @action
    updateAllowlist = () => {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        const userRulesData = userRulesProcessor.getData();
        const allowlist = userRulesData
            .filter((rule) => rule.type === UserRuleType.SITE_ALLOWED);
        const currentAllowRule = allowlist.find(
            (rule) => rule.domain === this.currentSite,
        );

        runInAction(() => {
            this.currentAllowRule = currentAllowRule;
            this.isAllowlisted = currentAllowRule?.enabled || false;
        });
    };

    @action
    getPopupData = async () => {
        runInAction(() => {
            this.popupDataReady = false;
        });

        await this.getCurrentTabUrl();

        const { settings, userRules, enableFiltersIds } = await sender.getPopupData();

        runInAction(() => {
            this.settings = settings;
            this.userRules = userRules;
            this.enableFiltersIds = enableFiltersIds;
        });

        await this.updateAllowlist();

        if (this.protectionPaused) {
            this.setProtectionPausedTimer();
        }

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
    updateCurrentTime = (time = Date.now()) => {
        this.currentTime = time;
    };

    @action
    resetCurrentTime = () => {
        this.updateCurrentTime(0);
    };

    @action
    setProtectionPausedTimer = () => {
        if (this.protectionPausedTimerId) {
            return;
        }

        this.setProtectionPausedTimerId(window.setInterval(async () => {
            this.updateCurrentTime();
            if (!this.protectionPaused) {
                await this.resetProtectionPausedTimeout();
            }
        }, PROTECTION_PAUSE_TIMEOUT_TICK_MS));
    };

    @action
    resetProtectionPausedTimeout = async () => {
        clearTimeout(this.protectionPausedTimerId);
        this.setProtectionPausedTimerId(0);
        await this.setProtection(true);
    };

    @action
    setUserRules = async (userRules: string) => {
        if (this.userRules === userRules) {
            return;
        }

        this.userRules = userRules;
        await sender.setUserRules(this.userRules);
    };

    @action
    toggleAllowlisted = async () => {
        this.setLoader(true);

        const newUserRules = await sender.toggleSiteAllowlistStatus(this.currentSite);
        await this.setUserRules(newUserRules);

        await this.updateAllowlist();

        this.setLoader(false);
    };

    @action
    setLoader = (value: boolean) => {
        this.loader = value;
    };
}
