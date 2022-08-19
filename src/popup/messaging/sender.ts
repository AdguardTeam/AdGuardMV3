import { sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES, PopupData } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { tabUtils } from 'Common/tab-utils';

/**
 * Module with methods used to communicate with background service worker
 */
class Sender {
    /**
     * Retrieves popup data from background service worker
     */
    getPopupData = (domainName: string) => sendMessage<PopupData>(MESSAGE_TYPES.GET_POPUP_DATA, { domainName });

    /**
     * Asks background service worker to open options page
     */
    openOptions = (path?: string) => sendMessage(MESSAGE_TYPES.OPEN_OPTIONS, { path });

    /**
     * Hides wizard
     */
    hideWizard = () => sendMessage(
        MESSAGE_TYPES.SET_SETTING, { update: { [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: false } },
    );

    /**
     * Asks background service worker to report site from active tab
     * @param from string key for tds-link
     */
    reportSite = (from: string) => sendMessage(MESSAGE_TYPES.REPORT_SITE, { from });

    /**
     * Asks background service worker to reload active tab
     */
    reloadActiveTab = () => sendMessage(MESSAGE_TYPES.RELOAD_ACTIVE_TAB);

    /**
     * Asks background service worker to open assistant on the active tab
     */
    openAssistant = async () => {
        const currentTab = await tabUtils.getActiveTab();
        return sendMessage(MESSAGE_TYPES.OPEN_ASSISTANT, { tab: currentTab });
    };

    /**
     * Suspends protection
     */
    pauseProtection = () => sendMessage(MESSAGE_TYPES.TOGGLE_PROTECTION, { value: false });

    /**
     * Enables protection
     */
    enableProtection = () => sendMessage(MESSAGE_TYPES.TOGGLE_PROTECTION, { value: true });

    /**
     * Suspends protection for the PROTECTION_PAUSE_TIMEOUT_MS time
     * @returns the date when the protection will be enabled again
     */
    pauseProtectionWithTimeout = (): Promise<number> => {
        return sendMessage<number>(MESSAGE_TYPES.PAUSE_PROTECTION_WITH_TIMEOUT);
    };

    /**
     * Enables, creates or deletes allowlist rule for provided site url
     * and notifies UI via NOTIFIER_EVENTS.SET_RULES
     * @returns allowlisted site or not
     */
    toggleSiteAllowlistStatus = (domainName: string): Promise<boolean> => {
        return sendMessage(MESSAGE_TYPES.TOGGLE_SITE_ALLOWLIST_STATUS, { domainName });
    };
}

export const sender = new Sender();
