import { MESSAGE_TYPES, STORAGE_KEYS } from 'Common/constants';
import { log } from 'Common/logger';
import { Message } from 'Common/types';
import { storage } from './storage';

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
    const { type, data } = message;

    switch (type) {
        case MESSAGE_TYPES.GET_PROTECTION_ENABLED: {
            return storage.get<boolean>(STORAGE_KEYS.PROTECTION_ENABLED);
        }
        case MESSAGE_TYPES.SET_PROTECTION_ENABLED: {
            const { protectionEnabled } = data;
            return storage.set(STORAGE_KEYS.PROTECTION_ENABLED, protectionEnabled);
        }
        case MESSAGE_TYPES.GET_NOTICE_HIDDEN: {
            return storage.get<boolean>(STORAGE_KEYS.NOTICE_HIDDEN);
        }
        case MESSAGE_TYPES.SET_NOTICE_HIDDEN: {
            const { noticeHidden } = data;
            return storage.set(STORAGE_KEYS.NOTICE_HIDDEN, noticeHidden);
        }
        case MESSAGE_TYPES.OPEN_OPTIONS: {
            return chrome.runtime.openOptionsPage();
        }
        case MESSAGE_TYPES.GET_CSS: {
            const isEnabled = await storage.get<boolean>(STORAGE_KEYS.PROTECTION_ENABLED);
            if (!isEnabled) {
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
