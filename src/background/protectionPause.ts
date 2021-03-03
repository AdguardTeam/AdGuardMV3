import { SETTINGS_NAMES } from 'Common/settings-constants';
import { settings } from './settings';

class ProtectionPause {
    private readonly alarmHandler: () => void;

    private readonly reloadPageHandler: (
        tabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
        tab: chrome.tabs.Tab
    ) => void;

    constructor() {
        this.alarmHandler = () => {
            chrome.alarms.onAlarm.removeListener(this.alarmHandler);
            settings.setSetting(SETTINGS_NAMES.PROTECTION_ENABLED, true);
        };

        this.reloadPageHandler = (tabId, changeInfo) => {
            if (changeInfo.status === 'complete' || changeInfo.status === 'loading') {
                const protectionPauseExpires = settings.getSetting(
                    SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES,
                );

                if (protectionPauseExpires !== 0 && protectionPauseExpires <= Date.now()) {
                    settings.setSetting(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES, 0);
                }
            }
        };
    }

    addTimer = (protectionPauseExpires: number) => {
        chrome.alarms.onAlarm.addListener(this.alarmHandler);
        chrome.alarms.create(
            SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES,
            { when: protectionPauseExpires },
        );
        chrome.tabs.onUpdated.addListener(this.reloadPageHandler);
    };

    removeTimer = () => {
        chrome.alarms.onAlarm.removeListener(this.alarmHandler);
        chrome.tabs.onUpdated.removeListener(this.reloadPageHandler);
    };
}

export const protectionPause = new ProtectionPause();
