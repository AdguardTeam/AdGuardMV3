import { TsWebExtension, Configuration, ConfigurationResult } from '@adguard/tswebextension/mv3';

import { FiltersGroupId, RULESET_NAME } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { log } from 'Common/logger';

import { DEFAULT_FILTERS, filters } from './filters';
import { settings } from './settings';
import { userRules } from './userRules';
import { browserActions } from './browser-actions';
import { filteringLog } from './filtering-log';

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

        await filteringLog.checkStatus(this.convertedSourceMap);
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

        await filteringLog.collectRulesInfo(this.convertedSourceMap);
    }

    static async saveDynamicRulesCounters({ dynamicRules }: ConfigurationResult) {
        await userRules.setUserRulesCounters({
            declarativeRulesCount: dynamicRules.declarativeRulesCounter,
            regexpsCount: dynamicRules.regexpRulesCounter,
        });
    }

    /**
     * If changed - save new values to store for show warning to user
     * and save list of last used filters
     */
    async checkFiltersLimitsChange() {
        const wasEnabledIds = (await filters.getFilters())
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
        const rules = await filters.getEnabledRules();
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
            filters: rules
                .map((r) => ({
                    filterId: r.id,
                    content: r.rules,
                })),
            allowlist: [],
            // TODO: maybe getRules should return array instead of string
            userrules: (await userRules.getRules())
                .split('\n')
                .filter((rule) => rule),
            verbose: isUnpacked,
        };
    };

    getMessageHandler() {
        return this.tsWebExtension.getMessageHandler();
    }

    get convertedSourceMap() {
        return this.tsWebExtension.convertedSourceMap;
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
            .map((f) => filters.filters.find(({ id }) => id === f.id));

        // A loop is needed to step through the asynchronous filter enable operation,
        // because each filter enable changes the constraints of the rules.
        for (let i = 0; i < localeFilters.length; i += 1) {
            const localeFilterInMemory = localeFilters[i];
            if (!localeFilterInMemory || localeFilterInMemory.enabled) {
                return;
            }

            const { id, localeCodes, declarativeRulesCounter } = localeFilterInMemory;

            // eslint-disable-next-line no-await-in-loop
            const availableStaticRulesCount = await chrome.declarativeNetRequest.getAvailableStaticRuleCount();
            const enabledStaticFiltersCount = filters.filters
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
