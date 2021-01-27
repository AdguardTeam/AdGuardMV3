import _ from 'lodash';

import { log } from 'Common/logger';
import { storage } from './storage';

export enum SETTINGS_NAMES {
    FILTERING_ENABLED = 'filtering.enabled',
    POPUP_V3_WIZARD_ENABLED = 'popup.v3.wizard.enabled',
}

class Settings {
    private DEFAULT_SETTINGS = {
        [SETTINGS_NAMES.FILTERING_ENABLED]: true,
        [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: true,
    };

    private SETTINGS_STORAGE_KEY = 'settings';

    private SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS = 1000;

    private settingsInMemory = this.DEFAULT_SETTINGS;

    public init = async () => {
        // TODO consider to make storage synchronous
        const storedSettings = await storage.get(this.SETTINGS_STORAGE_KEY);

        if (storedSettings) {
            this.settingsInMemory = { ...this.settingsInMemory, ...storedSettings };
        }

        log.debug('Settings module loaded successfully');
    };

    private updateStorage = _.throttle(async () => {
        await storage.set(this.SETTINGS_STORAGE_KEY, this.settingsInMemory);
    }, this.SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS);

    public getSetting = (key: SETTINGS_NAMES) => {
        return this.settingsInMemory[key];
    };

    public setSetting = (key: SETTINGS_NAMES, value: any) => {
        this.settingsInMemory[key] = value;
        this.updateStorage();
    };
}

export const settings = new Settings();
