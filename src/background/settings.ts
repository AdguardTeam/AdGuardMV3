import { throttle } from 'lodash';

import { log } from 'Common/logger';
import { storage } from './storage';

export enum SETTINGS_NAMES {
    FILTERING_ENABLED = 'filtering.enabled',
    POPUP_V3_WIZARD_ENABLED = 'popup.v3.wizard.enabled',
    NOTICE_HIDDEN = 'notice.hidden',
}

type SettingsType = { [key: string]: boolean };

class Settings {
    private DEFAULT_SETTINGS: SettingsType = {
        [SETTINGS_NAMES.FILTERING_ENABLED]: true,
        [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: true,
        [SETTINGS_NAMES.NOTICE_HIDDEN]: false,
    };

    private SETTINGS_STORAGE_KEY = 'settings';

    private SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS = 1000;

    private settingsInMemory = this.DEFAULT_SETTINGS;

    public init = async () => {
        // TODO consider to make storage synchronous
        const storedSettings = await storage.get<SettingsType>(this.SETTINGS_STORAGE_KEY);

        if (storedSettings) {
            this.settingsInMemory = { ...this.settingsInMemory, ...storedSettings };
        }

        log.debug('Settings module loaded successfully');
    };

    private updateStorage = throttle(async () => {
        await storage.set(this.SETTINGS_STORAGE_KEY, this.settingsInMemory);
    }, this.SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS);

    public getSetting = (key: SETTINGS_NAMES) => {
        return this.settingsInMemory[key];
    };

    public setSetting = (key: SETTINGS_NAMES, value: boolean) => {
        this.settingsInMemory[key] = value;
        this.updateStorage();
    };
}

export const settings = new Settings();
