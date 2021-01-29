import {
    FilteringState,
    Message,
    MESSAGE_TYPES,
    OptionsData,
    PopupData,
} from 'Common/constants';
import { log } from 'Common/logger';
import { settings, SETTINGS_NAMES } from './settings';
import { app } from './app';

interface MessageHandler {
    (message: Message, sender: chrome.runtime.MessageSender): any;
}

/**
 * Message handler wrapper used in order to handle async/await calls,
 * because chrome api by default do not support them
 * @param messageHandler
 */
const messageHandlerWrapper = (messageHandler: MessageHandler) => (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (...args: any[]) => void,
) => {
    messageHandler(message, sender)
        .catch((e: Error) => {
            log.error(e);
        })
        .then(sendResponse);
    return true;
};

/**
 * Message handler used to receive messages and send responses back on background page
 * from content-script, popup, option or another pages of extension
 * @param message
 * @param sender
 */
export const messageHandler = async (
    message: Message,
    sender: chrome.runtime.MessageSender,
) => {
    log.debug('Received message:', message, 'from: ', sender);

    await app.init();

    const { type, data } = message;

    switch (type) {
        case MESSAGE_TYPES.SET_FILTERING_ENABLED: {
            const { filteringEnabled } = data as FilteringState;

            return settings.setSetting(SETTINGS_NAMES.FILTERING_ENABLED, filteringEnabled);
        }
        case MESSAGE_TYPES.GET_OPTIONS_DATA: {
            return ({
                noticeHidden: settings.getSetting(SETTINGS_NAMES.NOTICE_HIDDEN),
                filteringEnabled: settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED),
            }) as OptionsData;
        }
        case MESSAGE_TYPES.SET_NOTICE_HIDDEN: {
            const { noticeHidden } = data as Pick<OptionsData, 'noticeHidden'>;

            return settings.setSetting(SETTINGS_NAMES.NOTICE_HIDDEN, noticeHidden);
        }
        case MESSAGE_TYPES.OPEN_OPTIONS: {
            return chrome.runtime.openOptionsPage();
        }
        case MESSAGE_TYPES.GET_POPUP_DATA: {
            const filteringEnabled = await settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED);
            const wizardEnabled = await settings.getSetting(SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED);
            return ({
                filteringEnabled,
                wizardEnabled,
            }) as PopupData;
        }
        case MESSAGE_TYPES.DISABLE_WIZARD: {
            return settings.setSetting(SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED, false);
        }
        case MESSAGE_TYPES.GET_CSS: {
            const filteringEnabled = settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED);
            if (!filteringEnabled) {
                return null;
            }
            // example rules
            return ['* { background-color: pink }'];
        }
        default: {
            throw new Error(`No message handler for type: ${type}`);
        }
    }
};

export const messaging = {
    init: () => {
        const messageListener = messageHandlerWrapper(messageHandler);
        chrome.runtime.onMessage.addListener(messageListener);
    },
};
