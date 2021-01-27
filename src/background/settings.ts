import _ from 'lodash';

import { log } from 'Common/logger';
import { storage } from './storage';

export enum SETTINGS_NAMES {
    FILTERING_ENABLED = 'filtering.enabled',
    POPUP_V3_WIZARD_ENABLED = 'popup.v3.wizard.enabled',
}

export const settings = (() => {
    const DEFAULT_SETTINGS = {
        [SETTINGS_NAMES.FILTERING_ENABLED]: true,
        [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: true,
    };

    const SETTINGS_STORAGE_KEY = 'settings';

    let settingsInMemory = DEFAULT_SETTINGS;

    const init = async () => {
        // TODO consider to make storage synchronous
        const storedSettings = await storage.get(SETTINGS_STORAGE_KEY);

        if (storedSettings) {
            settingsInMemory = { ...settingsInMemory, ...storedSettings };
        }

        log.debug('Settings module loaded successfully');
    };

    const THROTTLE_TIMEOUT_MS = 1000;
    const updateStorage = _.throttle(async () => {
        await storage.set(SETTINGS_STORAGE_KEY, settingsInMemory);
    }, THROTTLE_TIMEOUT_MS);

    const getSetting = (key: SETTINGS_NAMES) => {
        return settingsInMemory[key];
    };

    const setSetting = (key: SETTINGS_NAMES, value: any) => {
        settingsInMemory[key] = value;
        updateStorage();
    };

    return {
        init,
        getSetting,
        setSetting,
    };
})();
