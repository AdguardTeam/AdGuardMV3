import { log } from 'Common/logger';
import { prefs } from 'Common/prefs';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { notifier } from './notifier';
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
        const details: TabIconDetails = { path: prefs.ICONS.ENABLED };

        await this.setIcon(details);
        if (tabId) {
            details.tabId = tabId;
            await this.setIcon(details);
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
        const details: TabIconDetails = { path: prefs.ICONS.DISABLED };

        await this.setIcon(details);
        if (tabId) {
            details.tabId = tabId;
            await this.setIcon(details);
        }
    };

    onFilteringStateChange = async () => {
        const filteringEnabled = settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED);
        if (filteringEnabled) {
            await this.setIconEnabled();
        } else {
            await this.setIconDisabled();
        }
    };

    init() {
        this.onFilteringStateChange();

        notifier.addEventListener(NOTIFIER_EVENTS.SETTING_UPDATED, async ({ key }) => {
            if (key !== SETTINGS_NAMES.FILTERING_ENABLED) {
                return;
            }

            await this.onFilteringStateChange();
        });
    }
}

export const browserActions = new BrowserActions();
