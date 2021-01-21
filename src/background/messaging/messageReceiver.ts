import { MESSAGE_TYPES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';
import { storage } from '../storage';

type MessageType = keyof typeof MESSAGE_TYPES;
interface Message {
    type: MessageType;
    data: any;
}

export const messageReceiver = async (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (...args: any[]) => void,
) => {
    // FIXME make possible to receive objects
    log.debug('Received message:', message);
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
            const exampleRules = ['* { background-color: pink }'];

            if (isEnabled) {
                sendResponse(exampleRules);
            }
            return true;
        }
        default: {
            throw new Error(`No message handler for type: ${type}`);
        }
    }
};
