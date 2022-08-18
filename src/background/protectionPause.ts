import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';

import { notifier } from './notifier';
import { settings } from './settings';
import { tsWebExtensionWrapper } from './tswebextension';

class ProtectionPause {
    private alarmHandler = async (alarm: chrome.alarms.Alarm) => {
        if (alarm.name !== SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES) {
            return;
        }

        notifier.notify(NOTIFIER_EVENTS.PROTECTION_PAUSE_EXPIRED);
        await tsWebExtensionWrapper.start();

        await settings.setProtection(true);
        await settings.setProtectionPauseExpires(0);
        notifier.notify(NOTIFIER_EVENTS.PROTECTION_RESUMED);

        await this.removeTimer();
    };

    addTimer = (protectionPauseExpiresMs: number) => {
        chrome.alarms.onAlarm.addListener(this.alarmHandler);
        chrome.alarms.create(
            SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES,
            { when: protectionPauseExpiresMs },
        );
    };

    removeTimer = (): Promise<boolean> => {
        chrome.alarms.onAlarm.removeListener(this.alarmHandler);
        return chrome.alarms.clear(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES);
    };

    /**
     * Checks the protection pause timer and, if it does not exist, creates a new one
     */
    init = async () => {
        const expiresMs = settings.getSetting<number>(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES);
        const alarm = await chrome.alarms.get(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES);
        if (expiresMs > 0 && !alarm) {
            this.addTimer(expiresMs);
        }
    };
}

export const protectionPause = new ProtectionPause();
