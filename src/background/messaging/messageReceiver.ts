import { MESSAGE_TYPES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';

type MessageType = keyof typeof MESSAGE_TYPES;
interface Message {
    type: MessageType;
    data: any;
}

export const messageReceiver = (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (...args: any[]) => void,
) => {
    // FIXME make possible to receive objects
    log.debug('Received message:', message);
    const { type, data } = message;

    switch (type) {
        case MESSAGE_TYPES.GET_PROTECTION_ENABLED: {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], sendResponse);
            return true;
        }
        case MESSAGE_TYPES.SET_PROTECTION_ENABLED: {
            const { protectionEnabled } = data;
            chrome.storage.local.set(
                { [PROTECTION_ENABLED_KEY]: protectionEnabled },
                sendResponse,
            );
            return true;
        }
        case MESSAGE_TYPES.GET_CSS: {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], (data) => {
                const exampleRules = ['* { background-color: pink }'];

                if (data[PROTECTION_ENABLED_KEY]) {
                    sendResponse(exampleRules);
                }
            });
            return true;
        }
        default: {
            throw new Error(`No message handler for type: ${type}`);
        }
    }
};
