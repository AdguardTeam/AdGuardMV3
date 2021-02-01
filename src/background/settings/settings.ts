import { throttle } from 'lodash';

import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { storage } from '../storage';
import { notifier } from '../notifier';
import { DEFAULT_SETTINGS, SETTINGS_NAMES, SettingsType } from './settings-constants';

class Settings {
    private SETTINGS_STORAGE_KEY = 'settings';

    private SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS = 1000;

    private settings;

    constructor(defaultSettings: SettingsType) {
        this.settings = defaultSettings;
    }

    public init = async () => {
        const storedSettings = await storage.get<SettingsType>(this.SETTINGS_STORAGE_KEY);

        if (storedSettings) {
            this.settings = { ...this.settings, ...storedSettings };
        }

        log.debug('Settings module loaded successfully');
    };

    private updateStorage = throttle(async () => {
        await storage.set(this.SETTINGS_STORAGE_KEY, this.settings);
    }, this.SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS);

    public getSetting = (key: SETTINGS_NAMES) => {
        return this.settings[key];
    };

    public getSettings = () => {
        return this.settings;
    };

    public setSetting = (key: SETTINGS_NAMES, value: boolean) => {
        this.settings[key] = value;
        notifier.notify(NOTIFIER_EVENTS.SETTING_UPDATED, { key, value });
        this.updateStorage();
    };
}

export const settings = new Settings(DEFAULT_SETTINGS);
