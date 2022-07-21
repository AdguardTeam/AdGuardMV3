import { tabUtils } from 'Common/tab-utils';
import { log } from 'Common/logger';
import { prefs } from 'Common/prefs';

import { settings } from './settings';

type TabIconDetails = chrome.action.TabIconDetails;

class BrowserActions {
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

    init() {
        tabUtils.onActivated(() => this.onFilteringStateChange());
        tabUtils.onUpdated(() => this.onFilteringStateChange());
    }
}

export const browserActions = new BrowserActions();
