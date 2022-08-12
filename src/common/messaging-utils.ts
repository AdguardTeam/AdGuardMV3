import { nanoid } from 'nanoid';

import { NOTIFIER_EVENTS, MESSAGE_TYPES } from 'Common/constants/common';
import { log } from 'Common/logger';

export type NotifyMessage = {
    type: NOTIFIER_EVENTS,
    data: any,
};

/**
 * Creates long lived connections between UI and background service worker
 * @param identifier - title used to identify who opened the port
 * @param events - list of events to be listed
 * @param callback - will be called when the event has been triggered
 * @param onDisconnected - will be called ONLY when the port is closed by unloading service worker
 * @returns {function} - function called on onload
 */
export const createLongLivedConnection = (
    identifier: string,
    events: NOTIFIER_EVENTS[],
    callback: (message: NotifyMessage) => void,
    onDisconnected?: () => void,
) => {
    const port = chrome.runtime.connect({ name: `${identifier}_${nanoid()}` });
    let gracefulClosed: boolean | undefined;

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

        // Call onDisconnected only if the port is closed by unloading service worker
        if (!gracefulClosed && onDisconnected) {
            onDisconnected();
        }
    });

    const onUnload = () => {
        gracefulClosed = true;
        port.disconnect();
    };

    window.addEventListener('beforeunload', onUnload);
    window.addEventListener('unload', onUnload);

    return onUnload;
};
