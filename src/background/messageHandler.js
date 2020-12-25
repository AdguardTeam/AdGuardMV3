import { MESSAGES, PROTECTION_ENABLED_KEY } from '../common/constants';
import { log } from '../common/logger';

export const messageHandler = (request, sender, sendResponse) => {
    const { type } = request;

    switch (type) {
    case MESSAGES.GET_PROTECTION_ENABLED: {
        chrome.storage.local.get([PROTECTION_ENABLED_KEY], sendResponse);
        return true;
    }
    case MESSAGES.SET_PROTECTION_ENABLED: {
        try {
            /* Object { [PROTECTION_ENABLED_KEY]: boolean } */
            const { data } = request;
            chrome.storage.local.set(data);
            sendResponse(data);
        } catch (e) {
            log.error(e);
        }
        return true;
    }
    case MESSAGES.GET_CSS: {
        chrome.storage.local.get([PROTECTION_ENABLED_KEY], (data) => {
            const exampleRules = ['* { background-color: pink }'];

            if (data[PROTECTION_ENABLED_KEY]) {
                sendResponse(exampleRules);
            }
        });

        return true;
    }
    default:
        return true;
    }
};
