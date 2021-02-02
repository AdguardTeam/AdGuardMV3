import { Notifier } from '../src/background/notifier';

describe('notifier', () => {
    it('subscribes and notifies', () => {
        enum NOTIFIER_EVENTS {
            SETTING_UPDATED = 'event.setting.updated',
        }

        const notifier = new Notifier(NOTIFIER_EVENTS);

        const callback = jest.fn();

        notifier.addEventListener(NOTIFIER_EVENTS.SETTING_UPDATED, callback);
        expect(callback).not.toBeCalled();

        notifier.notify(NOTIFIER_EVENTS.SETTING_UPDATED);
        expect(callback).toBeCalled();

        const dummyArg = 'dummyArg';
        notifier.notify(NOTIFIER_EVENTS.SETTING_UPDATED, dummyArg);
        expect(callback).lastCalledWith(dummyArg);
    });

    it('notifies with event name', () => {
        enum NOTIFIER_EVENTS {
            SETTING_UPDATED = 'setting.updated',
        }

        const notifier = new Notifier(NOTIFIER_EVENTS);

        const callback = jest.fn();

        notifier.addEventListener([NOTIFIER_EVENTS.SETTING_UPDATED], callback);

        notifier.notify(notifier.events.SETTING_UPDATED);
        expect(callback).lastCalledWith(notifier.events.SETTING_UPDATED);

        const dummyArg = 'dummyArg';
        notifier.notify(notifier.events.SETTING_UPDATED, dummyArg);
        expect(callback).lastCalledWith(notifier.events.SETTING_UPDATED, dummyArg);
    });
});
