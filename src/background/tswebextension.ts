import { TsWebExtension, Configuration, ConfigurationResult } from '@adguard/tswebextension/mv3';

import { RULESET_NAME } from 'Common/constants/common';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';

import { CUSTOM_FILTERS_START_ID, filters } from './filters';
import { settings } from './settings';
import { userRules } from './userRules';
import { browserActions } from './browser-actions';

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
        const wasEnabledIds = (await filters.getEnableFiltersIds())
            // TODO: Maybe not best way to check for Custom filter
            .filter((id) => id < CUSTOM_FILTERS_START_ID)
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

        browserActions.setIconBroken(brokenState);

        if (brokenState) {
            await filters.setEnabledFiltersIds(nowEnabledIds);
            // Save last used filters ids to show user
            settings.setSetting(SETTINGS_NAMES.FILTERS_CHANGED, wasEnabledIds);

            await this.configure(true);
        } else if ((settings.getSetting(SETTINGS_NAMES.FILTERS_CHANGED) as number[]).length > 0) {
            settings.setSetting(SETTINGS_NAMES.FILTERS_CHANGED, []);
        }
    }

    private getConfiguration = async (): Promise<Configuration> => {
        const rules = await filters.getEnabledRules();

        return {
            settings: {
                allowlistEnabled: false,
                allowlistInverted: false,
                collectStats: true,
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
            verbose: true,
        };
    };

    getMessageHandler() {
        return this.tsWebExtension.getMessageHandler();
    }

    get convertedSourceMap() {
        return this.tsWebExtension.convertedSourceMap;
    }
}

export const tsWebExtensionWrapper = new TsWebExtensionWrapper();
