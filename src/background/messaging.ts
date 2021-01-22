import { MESSAGE_TYPES, PROTECTION_ENABLED_KEY } from '../common/constants';
import { log } from '../common/logger';
import { storage } from './storage';

type MessageType = keyof typeof MESSAGE_TYPES;

interface Message {
    type: MessageType;
    data: any;
}

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
    // FIXME make possible to log objects or another complicated objects like errors
    log.debug('Received message:', message, 'from: ', sender);
    const { type, data } = message;

    switch (type) {
        case MESSAGE_TYPES.GET_PROTECTION_ENABLED: {
            return storage.get(PROTECTION_ENABLED_KEY);
        }
        case MESSAGE_TYPES.SET_PROTECTION_ENABLED: {
            const { protectionEnabled } = data;
            return storage.set(PROTECTION_ENABLED_KEY, protectionEnabled);
        }
        case MESSAGE_TYPES.GET_CSS: {
            const isEnabled = await storage.get(PROTECTION_ENABLED_KEY);
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
