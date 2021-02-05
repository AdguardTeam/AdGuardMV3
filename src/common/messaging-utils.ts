import { nanoid } from 'nanoid';

import { MESSAGE_TYPES, Message, NOTIFIER_EVENTS } from 'Common/constants';
import { log } from 'Common/logger';

/**
 * Creates long lived connections between popup and background service worker
 * @param identifier - title used to identify who opened the port
 * @param events - list of events to be listed
 * @param callback
 * @returns {function} - function called on onload
 */
export const createLongLivedConnection = (
    identifier: string,
    events: NOTIFIER_EVENTS[],
    callback: (message: Message) => void,
) => {
    const port = chrome.runtime.connect({ name: `${identifier}_${nanoid()}` });

    port.postMessage({ type: MESSAGE_TYPES.ADD_LONG_LIVED_CONNECTION, data: { events } });

    port.onMessage.addListener((message) => {
        if (message.type === MESSAGE_TYPES.NOTIFY_LISTENERS) {
            const [type, ...data] = message.data;
            callback({ type, data });
        }
    });

    port.onDisconnect.addListener(() => {
        if (chrome.runtime.lastError) {
            log.debug(chrome.runtime.lastError.message);
        }
    });

    const onUnload = () => {
        port.disconnect();
    };

    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('unload', onUnload);

    return onUnload;
};
