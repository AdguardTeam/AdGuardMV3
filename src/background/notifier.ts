import { nanoid } from 'nanoid';
import { NOTIFIER_EVENTS } from 'Common/constants';

type Listener = {
    (...args: any[]): void
};

export class Notifier<T, U> {
    private listeners: { [key: string]: Listener } = {};

    private listenersEvents: { [key: string]: T | T[] } = {};

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

    addListener(listener: Listener): string {
        const listenerId = nanoid();
        this.listeners[listenerId] = listener;
        return listenerId;
    }

    addEventListener(events: T | T[], listener: Listener): string {
        const listenerId = nanoid();
        this.listeners[listenerId] = listener;
        this.listenersEvents[listenerId] = events;
        return listenerId;
    }

    removeListener(listenerId: string) {
        delete this.listeners[listenerId];
        delete this.listenersEvents[listenerId];
    }

    notify(event: T, ...args: any[]) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [listenerId, listener] of Object.entries(this.listeners)) {
            const listenersEvents = this.listenersEvents[listenerId];
            if (!listenersEvents) {
                // eslint-disable-next-line no-continue
                continue;
            }
            if (Array.isArray(listenersEvents) && listenersEvents.indexOf(event) < 0) {
                // eslint-disable-next-line no-continue
                continue;
            }
            try {
                if (Array.isArray(listenersEvents)) {
                    // if listener was added for many events, notify with event title
                    listener.apply(listener, [event, ...args]);
                } else {
                    listener.apply(listener, args);
                }
            } catch (e) {
                const message = `Error invoking listener for event: "${event}" cause: ${e}`;
                throw new Error(message);
            }
        }
    }
}

export const notifier = new Notifier<NOTIFIER_EVENTS, typeof NOTIFIER_EVENTS>(NOTIFIER_EVENTS);
