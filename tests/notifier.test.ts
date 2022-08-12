import { Notifier } from '../src/background/notifier';

describe('notifier', () => {
    it('subscribes and notifies', () => {
        enum NOTIFIER_EVENTS {
            SETTING_UPDATED = 'event.setting.updated',
            PROTECTION_UPDATED = 'event.protection.updated',
        }

        const notifier = new Notifier(NOTIFIER_EVENTS);

        const settingsCallback = jest.fn();
        const settingsAndProtectionCallback = jest.fn();

        notifier.addEventListener(
            [NOTIFIER_EVENTS.SETTING_UPDATED],
            settingsCallback,
        );
        expect(settingsCallback).not.toBeCalled();

        notifier.addEventListener(
            [NOTIFIER_EVENTS.SETTING_UPDATED, NOTIFIER_EVENTS.PROTECTION_UPDATED],
            settingsAndProtectionCallback,
        );
        expect(settingsAndProtectionCallback).not.toBeCalled();

        notifier.notify(NOTIFIER_EVENTS.SETTING_UPDATED);
        expect(settingsCallback).toBeCalledWith(NOTIFIER_EVENTS.SETTING_UPDATED);
        expect(settingsAndProtectionCallback).toBeCalledWith(NOTIFIER_EVENTS.SETTING_UPDATED);

        const dummyArg = 'dummyArg';
        notifier.notify(NOTIFIER_EVENTS.PROTECTION_UPDATED, dummyArg);
        expect(settingsAndProtectionCallback).lastCalledWith(NOTIFIER_EVENTS.PROTECTION_UPDATED, dummyArg);
    });
});
