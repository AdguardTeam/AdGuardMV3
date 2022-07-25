import { throttle } from 'lodash';

import { log } from 'Common/logger';
import { NOTIFIER_EVENTS } from 'Common/constants/common';
import {
    SettingsType,
    SETTINGS_NAMES,
    SettingsValueType,
    DEFAULT_SETTINGS,
    SCHEME_VERSION,
} from 'Common/constants/settings-constants';

import { storage } from './storage';
import { notifier } from './notifier';

class Settings {
    private SETTINGS_STORAGE_KEY = 'settings';

    private SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS = 1000;

    private settings: SettingsType;

    constructor(defaultSettings: SettingsType) {
        this.settings = defaultSettings;
    }

    public init = async () => {
        // The settings in the storage may be of an older version, so the type is 'any'
        const storedSettings = await storage.get<unknown>(this.SETTINGS_STORAGE_KEY);

        if (!storedSettings) {
            log.debug('Settings not found, using default');
            return;
        }

        if (Settings.isSettingsOutdated(storedSettings)) {
            log.debug(`Expected scheme version ${SCHEME_VERSION}. Run migrations`);
            try {
                const updatedSettings = await this.migrateSettings(storedSettings);
                this.settings = updatedSettings;
            } catch (e) {
                log.debug(`Migration to ${SCHEME_VERSION} failed, use default settings: `, e);
            }
            await this.updateStorage();
        } else {
            this.settings = storedSettings as SettingsType;
        }

        log.debug('Settings module loaded successfully');
    };

    private updateStorage = throttle(async () => {
        await storage.set(this.SETTINGS_STORAGE_KEY, this.settings);
    }, this.SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS);

    public getSetting = (key: SETTINGS_NAMES) => {
        return this.settings[key];
    };

    public getSettings = () => this.settings;

    public setSetting = (key: SETTINGS_NAMES, value: SettingsValueType) => {
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

    /**
     * Checks that settings is actual SettingsType
     */
    private isSettingsTypeCorrect = (settings: any): boolean => {
        return Object.keys(settings).every((key) => {
            return typeof DEFAULT_SETTINGS[key as SETTINGS_NAMES] === typeof settings[key];
        });
    };

    /**
     * Adds version to settings object
     */
    private migrateFrom0to1 = (oldSettings: any): any => {
        return {
            ...oldSettings,
            VERSION: 1,
        };
    };

    /**
     * In order to add migration, create new function which modifies old settings into new
     * And add this migration under related old settings scheme version
     * For example if your migration function migrates your settings from scheme 4 to 5, then add
     * it under number 4
     */
    private migrationFunctions: {
        [version: number]: (oldSettings: any) => any
    } = {
        0: this.migrateFrom0to1,
    };

    /**
     * Applying migrations one by one from the old version to the newest version
     */
    private async applyMigrations(
        oldVersion: number,
        newestVersion: number,
        oldSettings: any,
    ): Promise<SettingsType> {
        let migratedSettings = { ...oldSettings };
        for (let i = oldVersion; i < newestVersion; i += 1) {
            const migrationFunction = this.migrationFunctions[i];

            // eslint-disable-next-line no-await-in-loop
            migratedSettings = await migrationFunction(migratedSettings);
        }

        if (!this.isSettingsTypeCorrect(migratedSettings)) {
            throw new Error('Migrated settings is not the same type with default settings');
        }

        return migratedSettings as SettingsType;
    }

    /**
     * Gets version of settings object or 0 if not found version
     */
    private static getSettingsVersion(settings: any): number {
        if (!settings) {
            return 0;
        }

        const { version } = settings;
        return version
            ? Number.parseInt(version, 10)
            : 0;
    }

    /**
     * Checks scheme and migrate if needed
     */
    private static isSettingsOutdated(settings: any): boolean {
        const version = Settings.getSettingsVersion(settings);
        return version < SCHEME_VERSION;
    }

    /**
     * Runs migrations for settings
     */
    async migrateSettings(oldSettings: any): Promise<SettingsType> {
        const oldVersion = Settings.getSettingsVersion(oldSettings);
        const newestVersion = SCHEME_VERSION;
        const newSettings = await this.applyMigrations(
            oldVersion,
            newestVersion,
            oldSettings,
        );

        log.info(`Settings were converted from ${oldVersion} to ${SCHEME_VERSION}`);

        return newSettings;
    }
}

export const settings = new Settings(DEFAULT_SETTINGS);
