import { nanoid } from 'nanoid';

import { NOTIFIER_EVENTS } from 'Common/constants/common';

type Listener = {
    (...args: any[]): void
};

/**
 * Class implementing simple observer pattern
 */
export class Notifier<T, U> {
    private listeners: { [key: string]: Listener } = {};

    private listenersEvents: { [key: string]: T[] } = {};

    /**
     * Used for easier access to notifier events, e.g.
     * notifier.events.SETTING_UPDATED
     */
    public events: { [key: string]: NOTIFIER_EVENTS } = {};

    constructor(events: U) {
        Object.entries(events).forEach(([key, value]) => {
            this.events[key] = value;
        });
    }

    addEventListener(events: T | T[], listener: Listener): string {
        const listenerId = nanoid();
        this.listeners[listenerId] = listener;
        this.listenersEvents[listenerId] = Array.isArray(events) ? events : [events];
        return listenerId;
    }

    removeEventListener(listenerId: string) {
        delete this.listeners[listenerId];
        delete this.listenersEvents[listenerId];
    }

    notify(event: T, ...args: any[]) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [listenerId, listener] of Object.entries(this.listeners)) {
            const listenersEvents = this.listenersEvents[listenerId];
            if (listenersEvents.indexOf(event) < 0) {
                // eslint-disable-next-line no-continue
                continue;
            }

            try {
                listener.apply(listener, [event, ...args]);
            } catch (e) {
                const message = `Error invoking listener for event: "${event}" cause: ${e}`;
                throw new Error(message);
            }
        }
    }
}

export const notifier = new Notifier<NOTIFIER_EVENTS, typeof NOTIFIER_EVENTS>(NOTIFIER_EVENTS);
