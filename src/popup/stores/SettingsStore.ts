import {
    action,
    observable,
    makeObservable,
    computed,
    runInAction,
} from 'mobx';

import { log } from 'Common/logger';
import { getUrlDetails, isHttpRequest } from 'Common/helpers';
import {
    UserRuleType,
    MS_IN_SECOND,
    PROTECTION_PAUSE_TIMEOUT_TICK_MS,
    NEW_LINE_SEPARATOR,
} from 'Common/constants/common';
import {
    SettingsType,
    SettingsValueType,
    DEFAULT_SETTINGS,
    SETTINGS_NAMES,
} from 'Common/constants/settings-constants';
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
    settings: SettingsType = DEFAULT_SETTINGS;

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
        this.currentUrl = activeTab.url || '';
        this.applicationAvailable = !!isHttpRequest(this.currentUrl);
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
        // TODO: Fix these types
        if (key === SETTINGS_NAMES.FILTERS_CHANGED) {
            this.settings[key] = value as unknown as number[];
        } else if (key === SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES || key === SETTINGS_NAMES.VERSION) {
            this.settings[key] = value as unknown as number;
        } else {
            this.settings[key] = value as unknown as boolean;
        }
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
    updateAllowlist = async () => {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        const userRulesData = userRulesProcessor.getData();
        const allowlist = userRulesData.filter((rule) => rule.type === UserRuleType.SITE_ALLOWED);
        const currentAllowRule = allowlist.find(
            (rule) => rule.domain === this.currentSite,
        );

        const filteringEnabled = !!(currentAllowRule && currentAllowRule?.enabled);

        await this.setSetting(SETTINGS_NAMES.FILTERING_ENABLED, !filteringEnabled);

        runInAction(() => {
            this.currentAllowRule = currentAllowRule;
            this.isAllowlisted = !!currentAllowRule?.enabled;
        });
    };

    @action
    setEnableFiltersIds = (data: number[]) => {
        this.enableFiltersIds = data;
    };

    @action
    getPopupData = async () => {
        await this.getCurrentTabUrl();

        const { settings, userRules, enableFiltersIds } = await sender.getPopupData();

        this.setPopupDataReady(true);
        this.setSettings(settings);
        this.userRules = userRules;
        this.setEnableFiltersIds(enableFiltersIds);

        await this.updateAllowlist();

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
        await this.setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, true);
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

        if (this.currentAllowRule && this.isAllowlisted) {
            // remove rule
            const userRulesProcessor = new UserRulesProcessor(this.userRules);
            userRulesProcessor.deleteRule(this.currentAllowRule.id);
            await this.setUserRules(userRulesProcessor.getUserRules());
        } else if (this.currentAllowRule) {
            // enable rule if disable
            const userRulesProcessor = new UserRulesProcessor(this.userRules);
            userRulesProcessor.enableRule(this.currentAllowRule.id);
            await this.setUserRules(userRulesProcessor.getUserRules());
        } else {
            // add rule
            const newRule = `@@||${this.currentSite}^`;
            const newUserRules = `${this.userRules}${NEW_LINE_SEPARATOR}${newRule}`;
            await this.setUserRules(newUserRules);
        }
        await this.updateAllowlist();

        this.setLoader(false);
    };

    @action
    setLoader = (value: boolean) => {
        this.loader = value;
    };
}
