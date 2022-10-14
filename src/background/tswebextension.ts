import { TsWebExtension, Configuration, ConfigurationResult } from '@adguard/tswebextension/mv3';

import { FiltersGroupId, RULESET_NAME } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { log } from 'Common/logger';
import { IS_COLLECTING_LOG } from 'Common/constants/storage-keys';

import { DEFAULT_FILTERS, filters } from './filters';
import { settings } from './settings';
import { userRules } from './userRules';
import { browserActions } from './browser-actions';
import { storage } from './storage';

const {
    MAX_NUMBER_OF_ENABLED_STATIC_RULESETS,
} = chrome.declarativeNetRequest;

class TsWebExtensionWrapper {
    private tsWebExtension: TsWebExtension;

    constructor() {
        this.tsWebExtension = new TsWebExtension('/web-accessible-resources/redirects');
    }

    async start() {
        const config = await this.getConfiguration();
        const res = await this.tsWebExtension.start(config);
        await TsWebExtensionWrapper.saveDynamicRulesCounters(res);

        await this.checkFiltersLimitsChange();
    }

    async stop() {
        await this.tsWebExtension.stop();
    }

    async configure(skipCheck?: boolean) {
        const config = await this.getConfiguration();
        const res = await this.tsWebExtension.configure(config);
        await TsWebExtensionWrapper.saveDynamicRulesCounters(res);

        if (skipCheck) {
            return;
        }
        await this.checkFiltersLimitsChange();
    }

    static async saveDynamicRulesCounters({ dynamicRules }: ConfigurationResult) {
        if (dynamicRules) {
            const { ruleSets: [ruleset] } = dynamicRules;

            const declarativeRulesCount = ruleset.getRulesCount();
            const regexpsCount = ruleset.getRegexpRulesCount();

            await userRules.setUserRulesCounters({
                declarativeRulesCount,
                regexpsCount,
            });
        }
    }

    /**
     * If changed - save new values to store for show warning to user
     * and save list of last used filters
     */
    async checkFiltersLimitsChange() {
        const wasEnabledIds = (await filters.getFiltersInfo())
            .filter(({ groupId, enabled }) => enabled && groupId !== FiltersGroupId.CUSTOM)
            .map(({ id }) => id)
            .sort((a: number, b:number) => a - b);
        const nowEnabledIds = (await chrome.declarativeNetRequest.getEnabledRulesets())
            .map((s) => Number.parseInt(s.slice(RULESET_NAME.length), 10))
            .sort((a: number, b:number) => a - b);

        const isDifferent = () => {
            if (wasEnabledIds.length !== nowEnabledIds.length) {
                return true;
            }

            for (let i = 0; i <= wasEnabledIds.length; i += 1) {
                if (nowEnabledIds[i] !== wasEnabledIds[i]) {
                    return true;
                }
            }

            return false;
        };

        const brokenState = isDifferent();

        await browserActions.setIconBroken(brokenState);

        if (brokenState) {
            await filters.setEnabledFiltersIds(nowEnabledIds);
            // Save last used filters ids to show user
            await settings.setFiltersChangedList(wasEnabledIds);

            await this.configure(true);
        } else if (settings.getSetting<number[]>(SETTINGS_NAMES.FILTERS_CHANGED).length > 0) {
            await settings.setFiltersChangedList([]);
        }
    }

    private getConfiguration = async (): Promise<Configuration> => {
        const filtersInfo = filters.getFiltersInfo();
        const staticFiltersIds = filters.getEnableFiltersIds()
            .filter((id) => {
                const filterInfo = filtersInfo.find((f) => f.id === id);
                return filterInfo && filterInfo.groupId !== FiltersGroupId.CUSTOM;
            });
        const customFilters = filters.getEnabledCustomFiltersRules()
            .map((r) => ({
                filterId: r.id,
                content: r.rules,
            }));

        const filteringLogEnabled = await storage.get<boolean>(IS_COLLECTING_LOG) || false;

        const { installType } = await chrome.management.getSelf();
        const isUnpacked = installType === 'development';

        return {
            settings: {
                allowlistEnabled: false,
                allowlistInverted: false,
                collectStats: true,
                stealthModeEnabled: false,
                filteringEnabled: false,
                // TODO: check fields needed in the mv3
                stealth: {
                    blockChromeClientData: false,
                    hideReferrer: false,
                    hideSearchQueries: false,
                    sendDoNotTrack: false,
                    blockWebRTC: false,
                    selfDestructThirdPartyCookies: false,
                    selfDestructThirdPartyCookiesTime: 0,
                    selfDestructFirstPartyCookies: false,
                    selfDestructFirstPartyCookiesTime: 0,
                },
            },
            filteringLogEnabled,
            filtersPath: 'filters',
            ruleSetsPath: 'filters/declarative',
            staticFiltersIds,
            trustedDomains: [],
            customFilters,
            allowlist: [],
            // TODO: maybe getRules should return array instead of string
            userrules: (await userRules.getRules())
                .split('\n')
                .filter((rule) => rule),
            verbose: isUnpacked,
        };
    };

    /**
     * Returns tswebextension messages handler
     * @returns
     */
    getMessageHandler() {
        return this.tsWebExtension.getMessageHandler();
    }

    /**
     * Finds and enables filters for current browser locales
     */
    enableCurrentLanguagesFilters = async () => {
        const navigatorLocales = navigator.languages
            .map(((locale) => locale.replace('-', '_')));
        const locales = new Set(navigatorLocales);
        const localeFilters = DEFAULT_FILTERS
            .filter((f) => f.localeCodes?.some((code) => locales.has(code)))
            .map((f) => filters.getFiltersInfo().find(({ id }) => id === f.id));

        // A loop is needed to step through the asynchronous filter enable operation,
        // because each filter enable changes the constraints of the rules.
        for (let i = 0; i < localeFilters.length; i += 1) {
            const localeFilterInMemory = localeFilters[i];
            if (!localeFilterInMemory || localeFilterInMemory.enabled) {
                return;
            }

            // TODO: Export RuleSetsLoaderApi from tswebextension
            // and create rule sets here to have access to theirs counters
            const { id, localeCodes } = localeFilterInMemory;
            // FIXME:
            const declarativeRulesCounter = 0;

            // eslint-disable-next-line no-await-in-loop
            const availableStaticRulesCount = await chrome.declarativeNetRequest.getAvailableStaticRuleCount();
            const enabledStaticFiltersCount = filters.getFiltersInfo()
                .filter((f) => f.enabled && f.groupId !== FiltersGroupId.CUSTOM)
                .length;

            if (declarativeRulesCounter !== undefined
                    && declarativeRulesCounter < availableStaticRulesCount
                    && enabledStaticFiltersCount < MAX_NUMBER_OF_ENABLED_STATIC_RULESETS
            ) {
                log.debug(`Trying enable locale filter with id ${id} for locales: ${localeCodes}`);
                // eslint-disable-next-line no-await-in-loop
                await filters.enableFilter(id);
                // eslint-disable-next-line no-await-in-loop
                await this.configure();
            } else {
                log.debug(`Cannot enable locale filter with id ${id} for locales: ${localeCodes}`);
            }
        }
    };
}

export const tsWebExtensionWrapper = new TsWebExtensionWrapper();
