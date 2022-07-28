import { tabUtils } from 'Common/tab-utils';
import { log } from 'Common/logger';
import { prefs } from 'Common/prefs';
import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';

import { settings } from './settings';
import { notifier } from './notifier';

type TabIconDetails = chrome.action.TabIconDetails;

class BrowserActions {
    /**
     * The extension may be in a third state - "broken" - when the browser has changed
     * the current list of active rule sets, and we must notify the user of this
    */
    private broken: boolean = false;

    setIcon = (details: TabIconDetails) => {
        return new Promise<void>((resolve) => {
            chrome.action.setIcon(details, () => {
                if (chrome.runtime.lastError) {
                    log.debug(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    };

    setBadge = async (details: chrome.action.BadgeTextDetails) => {
        const BADGE_COLOR = '#ffffff';
        try {
            await chrome.action.setBadgeText(details);
            const { tabId } = details;
            await chrome.action.setBadgeBackgroundColor({ tabId, color: BADGE_COLOR });
        } catch (e: any) {
            log.debug(e.message);
        }
    };

    /**
     * Sets icon enabled. In order to remove blinking we set icon twice:
     * 1. for general browser action
     * 2. for tab browser action if tabId is provided
     */
    setIconEnabled = async (tabId?: number) => {
        try {
            const details: TabIconDetails = { path: prefs.ICONS.ENABLED };

            await this.setIcon(details);
            if (tabId) {
                details.tabId = tabId;
                await this.setIcon(details);
            }
        } catch (e) {
            log.info(e);
        }
    };

    /**
     * Sets browser cation icon disabled. In order to remove blinking we set icon twice:
     * 1. for general browser action
     * 2. for tab browser action if tabId is provided
     * @param {number|null} tabId
     * @returns {Promise<void>}
     */
    setIconDisabled = async (tabId?: number) => {
        try {
            const details: TabIconDetails = { path: prefs.ICONS.DISABLED };

            await this.setIcon(details);
            if (tabId) {
                details.tabId = tabId;
                await this.setIcon(details);
            }
        } catch (e) {
            log.info(e);
        }
    };

    async setIconByFiltering(filteringEnabled: boolean, tabId?: number) {
        if (filteringEnabled) {
            await this.setIconEnabled(tabId);
        } else {
            await this.setIconDisabled(tabId);
        }
    }

    onFilteringStateChange = async () => {
        const activeTab = await tabUtils.getActiveTab();
        if (!activeTab) {
            return;
        }
        const isFilteringEnabled = settings.filteringEnabled && settings.protectionEnabled;
        await this.setIconByFiltering(isFilteringEnabled as boolean, activeTab.id);
    };

    setIconBroken(value: boolean) {
        this.broken = value;

        if (this.broken) {
            this.setIcon({ path: prefs.ICONS.BROKEN });
        }
    }

    init() {
        const COUNTER_GREEN_COLOR = '#4d995f';
        chrome.declarativeNetRequest.setExtensionActionOptions({
            displayActionCountAsBadgeText: true,
        });
        chrome.action.setBadgeBackgroundColor({ color: COUNTER_GREEN_COLOR });

        tabUtils.onActivated(() => this.onFilteringStateChange());
        tabUtils.onUpdated(() => this.onFilteringStateChange());

        notifier.addEventListener(NOTIFIER_EVENTS.SETTING_UPDATED, async (data) => {
            try {
                if (this.broken) {
                    return;
                }

                const { key } = data;
                if (key !== SETTINGS_NAMES.FILTERING_ENABLED) {
                    return;
                }

                await this.onFilteringStateChange();
            } catch (e) {
                log.info(e);
            }
        });
    }
}

export const browserActions = new BrowserActions();
