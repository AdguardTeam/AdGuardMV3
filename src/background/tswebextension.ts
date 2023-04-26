import {
    TsWebExtension,
    Configuration,
    ConfigurationResult,
    RULE_SET_NAME_PREFIX,
    TooManyRulesError,
    TooManyRegexpRulesError,
} from '@adguard/tswebextension/mv3';

import { FiltersGroupId, RuleSetCounters, WEB_ACCESSIBLE_RESOURCES_PATH } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { log } from 'Common/logger';

import { DEFAULT_FILTERS, filters } from './filters';
import { settings } from './settings';
import { userRules } from './userRules';
import { browserActions } from './browser-actions';

const {
    MAX_NUMBER_OF_REGEX_RULES,
    MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES,
    MAX_NUMBER_OF_ENABLED_STATIC_RULESETS,
} = chrome.declarativeNetRequest;

// For tests
declare global {
    interface Window {
        adguard: {
            configure: (config: Configuration) => Promise<ConfigurationResult>;
        }
    }
}

class TsWebExtensionWrapper {
    private tsWebExtension: TsWebExtension;

    private configurationResult: ConfigurationResult | undefined;

    public filteringLogEnabled: boolean = false;

    constructor() {
        this.tsWebExtension = new TsWebExtension(WEB_ACCESSIBLE_RESOURCES_PATH);
        // adguard.configure() is needed for integration tests
        // eslint-disable-next-line no-restricted-globals
        self.adguard = {
            configure: this.tsWebExtension.configure.bind(this.tsWebExtension),
        };
    }

    public get ruleSetsCounters(): RuleSetCounters[] {
        return this.configurationResult?.staticFilters
            .map((ruleset) => ({
                filterId: Number(ruleset.getId().slice(RULE_SET_NAME_PREFIX.length)),
                rulesCount: ruleset.getRulesCount(),
                regexpRulesCount: ruleset.getRegexpRulesCount(),
            })) || [];
    }

    async start() {
        const config = await this.getConfiguration();
        this.configurationResult = await this.tsWebExtension.start(config);
        await TsWebExtensionWrapper.saveDynamicRulesInfo(this.configurationResult);

        await this.checkFiltersLimitsChange();
    }

    async stop() {
        await this.tsWebExtension.stop();
    }

    async configure(skipCheck?: boolean) {
        const config = await this.getConfiguration();
        this.configurationResult = await this.tsWebExtension.configure(config);
        await TsWebExtensionWrapper.saveDynamicRulesInfo(this.configurationResult);

        if (skipCheck) {
            return;
        }
        await this.checkFiltersLimitsChange();
    }

    static async saveDynamicRulesInfo({ dynamicRules }: ConfigurationResult) {
        const { ruleSets: [ruleset], limitations } = dynamicRules;

        const declarativeRulesCount = ruleset.getRulesCount();
        const regexpsCount = ruleset.getRegexpRulesCount();

        const rulesLimitExceedErr = limitations
            .find((e) => e instanceof TooManyRulesError);
        const regexpRulesLimitExceedErr = limitations
            .find((e) => e instanceof TooManyRegexpRulesError);

        await userRules.setUserRulesStatus({
            rules: {
                enabledCount: rulesLimitExceedErr?.numberOfMaximumRules || declarativeRulesCount,
                totalCount: declarativeRulesCount + (rulesLimitExceedErr?.numberOfExcludedDeclarativeRules || 0),
                maximumCount: rulesLimitExceedErr?.numberOfMaximumRules || MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES,
                limitExceed: rulesLimitExceedErr !== undefined,
                excludedRulesIds: rulesLimitExceedErr?.excludedRulesIds || [],
            },
            regexpsRules: {
                enabledCount: regexpsCount + (regexpRulesLimitExceedErr?.excludedRulesIds.length || 0),
                totalCount: declarativeRulesCount + (regexpRulesLimitExceedErr?.numberOfExcludedDeclarativeRules || 0),
                maximumCount: regexpRulesLimitExceedErr?.numberOfMaximumRules || MAX_NUMBER_OF_REGEX_RULES,
                limitExceed: regexpRulesLimitExceedErr !== undefined,
                excludedRulesIds: regexpRulesLimitExceedErr?.excludedRulesIds || [],
            },
        });
    }

    /**
     * If changed - save new values to store for show warning to user
     * and save list of last used filters
     */
    private async checkFiltersLimitsChange() {
        const wasEnabledIds = filters.getFiltersInfo()
            .filter(({ groupId, enabled }) => enabled && groupId !== FiltersGroupId.CUSTOM)
            .map(({ id }) => id)
            .sort((a: number, b:number) => a - b);
        const nowEnabledIds = (await chrome.declarativeNetRequest.getEnabledRulesets())
            .map((s) => Number.parseInt(s.slice(RULE_SET_NAME_PREFIX.length), 10))
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
            // Save last used filters ids to show user
            await settings.setFiltersChangedList(wasEnabledIds);
            await filters.setEnabledFiltersIds(nowEnabledIds);

            await this.configure(true);
        // If state is not broken - clear list of "broken" filters
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
            filteringLogEnabled: this.filteringLogEnabled,
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
     */
    getMessageHandler() {
        return this.tsWebExtension.getMessageHandler();
    }

    /**
     * Finds and enables filters for current browser locales
     */
    enableCurrentLanguagesFilters = async () => {
        // Cannot check rule sets counters
        if (!this.configurationResult) {
            return;
        }

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

            const { id, localeCodes } = localeFilterInMemory;
            const ruleSet = this.configurationResult.staticFilters.find((r) => {
                // TODO: Seems like weak relation, not too reliably
                return r.getId() === `${RULE_SET_NAME_PREFIX}${id}`;
            });
            const declarativeRulesCounter = ruleSet?.getRulesCount();

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
