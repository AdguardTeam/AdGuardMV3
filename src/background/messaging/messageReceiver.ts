import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';

export const messageReceiver = (message, sender, sendResponse) => {
    log.debug('Received message:', message);
    const { type, data } = message;

    const REQUEST_TYPE_TO_HANDLER_MAP = {
        [MESSAGES.GET_PROTECTION_ENABLED]: () => {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], sendResponse);
            return true;
        },
        // FIXME front should know about setting key
        [MESSAGES.SET_PROTECTION_ENABLED]: (data) => {
            try {
                /* Object { [PROTECTION_ENABLED_KEY]: boolean } */
                chrome.storage.local.set(data);
                sendResponse(data);
            } catch (e) {
                log.error(e);
            }
            return true;
        },
        [MESSAGES.GET_CSS]: () => {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], (data) => {
                const exampleRules = ['* { background-color: pink }'];

                if (data[PROTECTION_ENABLED_KEY]) {
                    sendResponse(exampleRules);
                }
            });

            return true;
        },
    };

    if (!Object.prototype.hasOwnProperty.call(REQUEST_TYPE_TO_HANDLER_MAP, type)) {
        log.warn(`There is no such message type ${type}`);
        return undefined;
    }

    return REQUEST_TYPE_TO_HANDLER_MAP[type](data);
};
