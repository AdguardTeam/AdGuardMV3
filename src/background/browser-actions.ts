import { getUrlDetails } from 'Common/helpers';
import { tabUtils } from 'Common/tab-utils';
import { log } from 'Common/logger';
import { prefs } from 'Common/prefs';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { notifier } from './notifier';
import { userRules } from './userRules';

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

    setIconByFiltering(filteringEnabled: boolean, tabId?: number) {
        if (filteringEnabled) {
            this.setIconDisabled(tabId);
        } else {
            this.setIconEnabled(tabId);
        }
    }

    onFilteringStateChange = async () => {
        try {
            const activeTab = await tabUtils.getActiveTab();

            if (activeTab?.url) {
                const urlDetails = getUrlDetails(activeTab.url);

                if (urlDetails?.domainName) {
                    const currentAllowRule = userRules.getCurrentAllowRule(urlDetails.domainName);

                    const filteringEnabled = !!currentAllowRule?.enabled;

                    this.setIconByFiltering(filteringEnabled, activeTab.id);
                }
            }
        } catch (e) {
            log.info(e);
        }
    };

    init() {
        tabUtils.onActivated(() => this.onFilteringStateChange());
        tabUtils.onUpdated(() => this.onFilteringStateChange());

        notifier.addEventListener(NOTIFIER_EVENTS.SETTING_UPDATED, async (data) => {
            try {
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
