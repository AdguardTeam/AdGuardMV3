import { throttle } from 'lodash';

import { log } from 'Common/logger';
import { FiltersGroupId, NOTIFIER_EVENTS, Rules } from 'Common/constants/common';
import {
    SettingsType,
    SETTINGS_NAMES,
    SettingsValueType,
    DEFAULT_SETTINGS,
    SCHEME_VERSION,
} from 'Common/constants/settings-constants';
import { CUSTOM_FILTERS_RULES_STORAGE_KEY, FILTERS_INFO_STORAGE_KEY } from 'Common/constants/storage-keys';

import { storage } from './storage';
import { notifier } from './notifier';
import Obsolete from './obsoleted';

// TODO: Move the migration to a separate module. This is not currently needed
// since the current application is a prototype and there are several modules,
// each with their own properties in the repository.
class Settings {
    private SETTINGS_STORAGE_KEY = 'settings';

    private SAVE_TO_STORAGE_THROTTLE_TIMEOUT_MS = 1000;

    private settings: SettingsType;

    constructor(defaultSettings: SettingsType) {
        this.settings = defaultSettings;
    }

    public init = async () => {
        // The settings in the storage may be of an older version,
        // so the type is 'unknown'
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

    public getSetting = <T extends SettingsValueType>(key: SETTINGS_NAMES): T => {
        return this.settings[key] as T;
    };

    public getSettings = () => this.settings;

    public setSetting = async (update: Partial<SettingsType>) => {
        Object.assign(this.settings, update);
        await this.updateStorage();
    };

    public get protectionEnabled() {
        return this.settings[SETTINGS_NAMES.PROTECTION_ENABLED];
    }

    /**
     * Sets protections and notifies UI via NOTIFIER_EVENTS.PROTECTION_UPDATED
     */
    public setProtection = async (value: boolean) => {
        await this.setSetting({ [SETTINGS_NAMES.PROTECTION_ENABLED]: value });
        notifier.notify(NOTIFIER_EVENTS.PROTECTION_UPDATED, { value });
    };

    /**
     * Sets protection pause expires
     */
    public setProtectionPauseExpires = async (value: number) => {
        await this.setSetting({ [SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES]: value });
    };

    public setFiltersChangedList = async (ids: number[]) => {
        await this.setSetting({ [SETTINGS_NAMES.FILTERS_CHANGED]: ids });
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
     * Adds version and list of changed filters (mv3 limits) to settings object
     */
    private migrateFrom0to1 = (oldSettings: any): any => {
        return {
            ...oldSettings,
            [SETTINGS_NAMES.FILTERS_CHANGED]: [],
            [SETTINGS_NAMES.VERSION]: 1,
        };
    };

    /**
     * Remove unused field from settings object
     */
    private migrateFrom1to2 = (oldSettings: any): any => {
        // Create deep copy
        const copyObject = JSON.parse(JSON.stringify(oldSettings));

        // Delete old key
        delete copyObject['filtering.enabled'];

        return {
            ...copyObject,
            [SETTINGS_NAMES.VERSION]: 2,
        };
    };

    /**
     * Removing obsolete counters of user rules, counters of filters rules and
     * static filters rules
     */
    private migrateFrom2to3 = async (oldSettings: any): Promise<any> => {
        /**
         * Remove counters from filter objects, since these counters are now
         * stored in rule sets that will be returned from tswebextension as
         * a result of the configuration
         *
         * @see {@link TsWebExtensionWrapper.configurationResult}
         */
        const filters = await storage.get<Obsolete.Filter[]>(Obsolete.FILTERS_STORAGE_KEY);
        if (filters) {
            const filtersInfo = filters.map((filter) => {
                // eslint-disable-next-line no-param-reassign
                delete filter.regexpRulesCounter;
                // eslint-disable-next-line no-param-reassign
                delete filter.declarativeRulesCounter;

                return filter;
            });

            await storage.set(FILTERS_INFO_STORAGE_KEY, filtersInfo);
        }

        // Remove static filter rules from the storage.
        // Save only the rules from the custom filters.
        const rules = await storage.get<Rules[]>(Obsolete.RULES_STORAGE_KEY);
        if (rules) {
            const customFiltersRules = rules.filter(({ id }) => {
                return filters?.find((f) => f.id === id && f.groupId === FiltersGroupId.CUSTOM);
            });

            await storage.set(CUSTOM_FILTERS_RULES_STORAGE_KEY, customFiltersRules);
        }

        // Remove obsoleted user rules limits
        await storage.remove(Obsolete.FILTERS_STORAGE_KEY);

        // Remove obsoleted user rules limits
        await storage.remove(Obsolete.RULES_STORAGE_KEY);

        // Remove obsoleted user rules limits
        await storage.remove(Obsolete.USER_RULES_LIMITS_STORAGE_KEY);

        return {
            ...oldSettings,
            [SETTINGS_NAMES.VERSION]: 3,
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
        1: this.migrateFrom1to2,
        2: this.migrateFrom2to3,
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
