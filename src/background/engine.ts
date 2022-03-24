import * as TSUrlFilter from '@adguard/tsurlfilter';

import { log } from 'Common/logger';
import { urlUtils } from 'Common/utils/url-utils';
import {
    RULES_STORAGE_KEY,
    FILTER_RULESET,
    Rules,
    USER_RULES_STORAGE_KEY,
    ENABLED_FILTERS_IDS,
} from 'Common/constants';
import { storage } from './storage';
import { cssService } from './css-service';

class Engine {
    ASYNC_LOAD_CHUNK_SIZE = 5000;

    engine: TSUrlFilter.Engine | null = null;

    enginePromise: Promise<TSUrlFilter.Engine> | null = null;

    init = async (restart = false) => {
        if (restart) {
            this.engine = null;
            this.enginePromise = null;
        }

        if (!this.enginePromise) {
            this.enginePromise = this.startEngine();
        }

        if (!this.engine) {
            this.engine = await this.enginePromise;
        }
    };

    startEngine = async () => {
        log.info('Starting url filter engine');
        const lists: TSUrlFilter.StringRuleList[] = [];

        const filters: Rules[] = await storage.get(
            RULES_STORAGE_KEY,
        );

        const userRules: string = await storage.get(
            USER_RULES_STORAGE_KEY,
        );

        const enabledFiltersIds: number[] = await storage.get(
            ENABLED_FILTERS_IDS,
        );

        const userFilter = {
            id: FILTER_RULESET.USER_RULES,
            rules: userRules,
        };

        const enabledFilters = filters
            .filter((filter) => enabledFiltersIds.includes(filter.id));

        [userFilter, ...enabledFilters].forEach((filter) => {
            const filterList = new TSUrlFilter.StringRuleList(
                filter.id, filter.rules, false, false, false,
            );
            lists.push(filterList);
        });

        const ruleStorage = new TSUrlFilter.RuleStorage(lists);

        const config = {
            engine: 'extension',
            version: chrome.runtime.getManifest().version,
            verbose: true,
            compatibility: TSUrlFilter.CompatibilityTypes.extension,
        };

        TSUrlFilter.setConfiguration(config);

        const engine = new TSUrlFilter.Engine(ruleStorage, true);

        /*
         * UI thread becomes blocked on the options page while request filter is created
         * that's why we create filter rules using chunks of the specified length
         * Request filter creation is rather slow operation so we should
         * use setTimeout calls to give UI thread some time.
        */
        await engine.loadRulesAsync(this.ASYNC_LOAD_CHUNK_SIZE);

        log.info('Starting url filter engine..ok');

        return engine;
    };

    /**
     * Gets cosmetic result for the specified hostname and cosmetic options
     *
     * @param url
     * @param option
     * @returns CosmeticResult result
     */
    getCosmeticResult = (url: string, option: TSUrlFilter.CosmeticOption) => {
        if (!this.engine) {
            return new TSUrlFilter.CosmeticResult();
        }

        const frameUrl = urlUtils.getHost(url);
        const request = new TSUrlFilter.Request(url, frameUrl, TSUrlFilter.RequestType.Document);

        return this.engine.getCosmeticResult(request, option);
    };

    /**
     * Builds CSS for the specified web page.
     * http://adguard.com/en/filterrules.html#hideRules
     *
     * @param {string} url Page URL
     * @param {number} options bitmask
     * @param {boolean} ignoreTraditionalCss flag
     * @param {boolean} ignoreExtCss flag
     * @returns {*} CSS and ExtCss data for the webpage
     */
    getSelectorsForUrl(
        url: string,
        options: TSUrlFilter.CosmeticOption,
        ignoreTraditionalCss: boolean,
        ignoreExtCss: boolean,
    ) {
        const cosmeticResult = this.getCosmeticResult(url, options);

        const elemhideCss = [
            ...cosmeticResult.elementHiding.generic,
            ...cosmeticResult.elementHiding.specific,
        ];
        const injectCss = [
            ...cosmeticResult.CSS.generic,
            ...cosmeticResult.CSS.specific,
        ];

        const elemhideExtCss = [
            ...cosmeticResult.elementHiding.genericExtCss,
            ...cosmeticResult.elementHiding.specificExtCss,
        ];
        const injectExtCss = [
            ...cosmeticResult.CSS.genericExtCss,
            ...cosmeticResult.CSS.specificExtCss,
        ];

        // TODO handle statistics collection
        // const collectingCosmeticRulesHits = webRequestService.isCollectingCosmeticRulesHits();
        // if (collectingCosmeticRulesHits) {
        //     const styles = !ignoreTraditionalCss
        // ? cssService.buildStyleSheetHits(elemhideCss, injectCss) : [];
        //     const extStyles = !ignoreExtCss
        // ? cssService.buildStyleSheetHits(elemhideExtCss, injectExtCss) : [];
        //     return {
        //         css: styles,
        //         extendedCss: extStyles,
        //     };
        // }

        const styles = !ignoreTraditionalCss
            ? cssService.buildStyleSheet(elemhideCss, injectCss, true)
            : [];
        const extStyles = !ignoreExtCss
            ? cssService.buildStyleSheet(elemhideExtCss, injectExtCss, false)
            : [];

        return {
            css: styles,
            extendedCss: extStyles,
        };
    }
}

export const engine = new Engine();
