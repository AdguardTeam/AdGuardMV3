import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';

export const messageReceiver = (request, sender, sendResponse) => {
    const { type, data } = request;

    const receiver = {
        [MESSAGES.GET_PROTECTION_ENABLED]: () => {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], sendResponse);
            return true;
        },
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

    return receiver[type](data);
};
