import { useEffect } from 'react';

import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { createLongLivedConnection, NotifyMessage } from 'Common/messaging-utils';

export type EventListeners = Partial<Record<NOTIFIER_EVENTS, (data: any) => void>>;

/**
 * Returns a function that will create long live connection to service worker
 * and which will reconnect, if service worker has been restarted
 */
export const useEventListener = (
    identifier: string,
    listeners: EventListeners,
) => {
    useEffect(() => {
        const events = Object.keys(listeners) as unknown as NOTIFIER_EVENTS[];

        const messageHandler = async (message: NotifyMessage) => {
            const { type, data: [data] } = message;

            const handler = listeners[type];
            if (handler) {
                handler(data);
            } else {
                throw new Error(`Non supported event type: ${type} in ${identifier}`);
            }
        };

        const onDisconnected = () => {
            createLongLivedConnection(identifier, events, messageHandler, onDisconnected);
        };

        return createLongLivedConnection(identifier, events, messageHandler, onDisconnected);
    }, []);
};
