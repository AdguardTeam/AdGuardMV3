import { throttle } from 'lodash';

import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants';
import { DEFAULT_SETTINGS, SETTINGS_NAMES, SettingsType } from 'Common/settings-constants';
import { storage } from './storage';
import { notifier } from './notifier';

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

    public setSetting = (key: SETTINGS_NAMES, value: any) => {
        this.settings[key] = value;
        notifier.notify(NOTIFIER_EVENTS.SETTING_UPDATED, { key, value });
        this.updateStorage();
    };

    public enableFiltering = () => {
        this.setSetting(SETTINGS_NAMES.FILTERING_ENABLED, true);
    };

    public disableFiltering = () => {
        this.setSetting(SETTINGS_NAMES.FILTERING_ENABLED, false);
    };

    public filteringEnabled = () => {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED];
    };
}

export const settings = new Settings(DEFAULT_SETTINGS);
