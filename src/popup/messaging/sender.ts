import { sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES, PopupData } from 'Common/constants';
import { SETTINGS_NAMES, SettingsValueType } from 'Common/settings-constants';
import { tabUtils } from 'Common/tab-utils';

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
    openOptions = () => sendMessage(MESSAGE_TYPES.OPEN_OPTIONS);

    /**
     * Sets setting value by key
     * @param key
     * @param value
     */
    setSetting = (key: SETTINGS_NAMES, value: SettingsValueType) => sendMessage(
        MESSAGE_TYPES.SET_SETTING,
        { key, value },
    );

    /**
     * Asks background service worker to report site from active tab
     */
    reportSite = () => sendMessage(MESSAGE_TYPES.REPORT_SITE);

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
}

export const sender = new Sender();
