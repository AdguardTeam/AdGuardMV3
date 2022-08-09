import { sendMessage } from 'Common/helpers';
import { PopupData, MESSAGE_TYPES } from 'Common/constants/common';
import { POPUP_SETTINGS } from 'Common/constants/settings-constants';
import { tabUtils } from 'Common/tab-utils';
import { UserRulesData } from 'Options/user-rules-processor';

/**
 * Module with methods used to communicate with background service worker
 */
class Sender {
    /**
     * Retrieves popup data from background service worker
     */
    getPopupData = () => sendMessage<PopupData>(MESSAGE_TYPES.GET_POPUP_DATA);

    /**
     * Asks background service worker to open options page
     */
    openOptions = (path?: string) => sendMessage(MESSAGE_TYPES.OPEN_OPTIONS, { path });

    /**
     * Sets settings value on background service worker by key
     * @param key
     * @param value
     */
    setSetting = (update: Partial<POPUP_SETTINGS>) => sendMessage(
        MESSAGE_TYPES.SET_SETTING, { update },
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

    removeProtectionPauseTimer = () => sendMessage(MESSAGE_TYPES.REMOVE_PROTECTION_PAUSE_TIMER);

    setPauseExpires = (protectionPauseExpires: number) => sendMessage(
        MESSAGE_TYPES.SET_PAUSE_EXPIRES,
        { protectionPauseExpires },
    );

    getUserRules = (): Promise<string> => {
        return sendMessage(MESSAGE_TYPES.GET_USER_RULES);
    };

    setUserRules = (userRules: string): Promise<void> => {
        return sendMessage(MESSAGE_TYPES.SET_USER_RULES, { userRules });
    };

    toggleSiteAllowlistStatus = (domainName: string): Promise<string> => {
        return sendMessage(MESSAGE_TYPES.TOGGLE_SITE_ALLOWLIST_STATUS, { domainName });
    };

    checkSiteInAllowlist = (domainName: string): Promise<UserRulesData | undefined> => {
        return sendMessage(MESSAGE_TYPES.CHECK_SITE_IN_ALLOWLIST, { domainName });
    };
}

export const sender = new Sender();
