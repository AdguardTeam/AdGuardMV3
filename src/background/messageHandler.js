/* global chrome */
import { MESSAGES, PROTECTION_ENABLED_KEY } from '../common/constants';
import log from '../common/logger';

const messageHandler = (request, sender, sendResponse) => {
    const { type } = request;

    switch (type) {
        case MESSAGES.getProtectionEnabled: {
            chrome.storage.local.get([PROTECTION_ENABLED_KEY], (data) => {
                sendResponse({ data });
            });
            return true;
        }
        case MESSAGES.setProtectionEnabled: {
            try {
                const data = { [PROTECTION_ENABLED_KEY]: request.data[PROTECTION_ENABLED_KEY] };

                chrome.storage.local.set(data);
                sendResponse(data);
            } catch (e) {
                log.error(e);
            }
            return true;
        }
        case MESSAGES.getCss: {
            const exampleRules = ['* { background-color: pink }'];

            sendResponse(exampleRules);
            return true;
        }
        default:
            return true;
    }
};

export default messageHandler;
