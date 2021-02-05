import { sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES, PopupData } from 'Common/constants';
import { SETTINGS_NAMES } from 'Common/settings-constants';
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
    setSetting = (key: SETTINGS_NAMES, value: boolean) => sendMessage(
        MESSAGE_TYPES.SET_SETTING,
        { key, value },
    );

    /**
     * Asks background service worker to report site from active tab
     */
    reportSite = () => sendMessage(MESSAGE_TYPES.REPORT_SITE);

    /**
     * Asks background service worker to open assistant on the active tab
     */
    openAssistant = async () => {
        const currentTab = await tabUtils.getActiveTab();
        return sendMessage(MESSAGE_TYPES.OPEN_ASSISTANT, { tab: currentTab });
    };
}

export const sender = new Sender();
