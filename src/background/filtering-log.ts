import { FilterConvertedSourceMap, USER_FILTER_ID, HashOriginalRule } from '@adguard/tswebextension/mv3';
import { DeclarativeConverter } from '@adguard/tsurlfilter';

import { NEW_LINE_SEPARATOR, RULESET_NAME } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { arrayToMap } from 'Common/utils/arrays';
import { IS_COLLECTING_LOG } from 'Common/constants/storage-keys';

import { COMMON_FILTERS_DIR } from './backend';
import { filters } from './filters';
import { userRules } from './userRules';
import { storage } from './storage';

type FilterId = number;
type ConvertedSourceMaps = Map<FilterId, FilterConvertedSourceMap>;

const {
    onRuleMatchedDebug,
} = chrome.declarativeNetRequest;

export type RecordFiltered = {
    ruleId: number,
    rulesetId: string,
    frameId: number,
    initiator: string | undefined,
    method: string,
    requestId: string,
    tabId: number,
    type: string,
    url: string,
} & RuleInfo;

type RuleInfo = {
    originalRuleTxt?: string,
    filterName?: string,
    filterId?: number,
    declarativeRuleJson: string,
};

// TODO: Maybe collect filter info to one "supertype"
class FilteringLog {
    private collected: RecordFiltered[] = [];

    private convertedSourceMap: FilterConvertedSourceMap = new Map();

    private filtersNames: Map<number, string> = new Map();

    private staticFiltersIds: Set<number> = new Set();

    private sourceFilters: string[] = [];

    private convertedSourceMaps: ConvertedSourceMaps = new Map();

    private filters: chrome.declarativeNetRequest.Rule[][] = [];

    /** Is collecting matched rules or not  */
    private isCollecting: boolean = false;

    /**
     * Load converted declarative json rules
     */
    private getFilterDeclarative = async (id: number) => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/declarative/filter_${id}.json`);
        const file = await fetch(url);
        this.filters[id] = await file.json() as chrome.declarativeNetRequest.Rule[];
    };

    /**
     * Load original filters
     */
    private getFilterSourceRules = async (id: number) => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${id}.txt`);
        const file = await fetch(url);
        this.sourceFilters[id] = await file.text();
    };

    /**
     * Load dictionary of converted rules
     */
    private getFilterSourceMap = async (id: number) => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${id}.json.map`);
        const file = await fetch(url);
        const arr = await file.json() as Array<Array<number>>;
        this.convertedSourceMaps.set(id, arrayToMap(arr));
    };

    /**
     * Collect filter names, custom filter rules, custom rules, and source maps for them
     */
    public collectRulesInfo = async (convertedSourceMap: FilterConvertedSourceMap) => {
        if (!this.isCollecting) {
            return;
        }

        this.convertedSourceMap = convertedSourceMap;
        this.filters[USER_FILTER_ID] = await chrome.declarativeNetRequest.getDynamicRules();
        filters.rules
            // Stays only custom filters
            .filter(({ id }) => !this.staticFiltersIds.has(id))
            .forEach(({ id, rules }) => {
                this.sourceFilters[id] = rules;
            });
        this.sourceFilters[USER_FILTER_ID] = await userRules.getRules();

        this.filtersNames = new Map(filters.filters.map(({ id, title }) => [id, title]));
        this.filtersNames.set(USER_FILTER_ID, 'userrules');
    };

    /**
     * Retrieves filtering status from storage and save to private field
     * and starts collecting if enabled
     */
    public checkStatus = async (convertedSourceMap: FilterConvertedSourceMap) => {
        this.isCollecting = await storage.get<boolean>(IS_COLLECTING_LOG) || false;

        if (this.isCollecting) {
            await this.start(convertedSourceMap);
        }
    };

    /**
     * If collection is enabled - then get rules (transformed, declarative and source maps)
     * from filters and the same information about dynamic rules
     */
    public init = async (convertedSourceMap: FilterConvertedSourceMap) => {
        const staticFiltersIds = filters.getManifestRulesets()
            .map(({ id }: ManifestRulesetInfo) => {
                return Number.parseInt(id.slice(RULESET_NAME.length), 10);
            });

        this.staticFiltersIds = new Set(staticFiltersIds);
        const requests = staticFiltersIds
            .map(async (id) => Promise.all([
                this.getFilterDeclarative(id),
                this.getFilterSourceRules(id),
                this.getFilterSourceMap(id),
            ]));

        await Promise.all(requests);
        await this.collectRulesInfo(convertedSourceMap);
    };

    /**
     * Returns converted declarative json rule, original txt rule, filter name and id
     * @param filterIdString filter id
     * @param ruleId rule id in this filter
     * @returns converted declarative json rule, original txt rule, filter name and id
     */
    private getRuleInfo = (filterIdString: string, ruleId: number): RuleInfo => {
        const getHash = (n: number) => DeclarativeConverter.storageIdxToRuleListIdx(n);
        const getSourceRule = (filterContent: string, ruleIdx: number) => {
            let posStartRule = ruleIdx;

            // Skip spaces, tabs and new lines
            while (['\n', '\t', '\r'].includes(filterContent[posStartRule])) {
                posStartRule += 1;
            }

            // Check, that we didn't exit from string
            if (posStartRule >= filterContent.length) {
                posStartRule = filterContent.length - 1;
            }

            const posEndRule = filterContent.indexOf(NEW_LINE_SEPARATOR, posStartRule);
            return posEndRule === -1 // end of file
                ? filterContent.slice(posStartRule)
                : filterContent.slice(posStartRule, posEndRule);
        };

        // Custom filter or user rules
        if (filterIdString === chrome.declarativeNetRequest.DYNAMIC_RULESET_ID) {
            const declarativeRule = this.filters[USER_FILTER_ID].find(({ id }) => id === ruleId);
            const res = {
                declarativeRuleJson: JSON.stringify(declarativeRule, null, 4),
            } as RuleInfo;

            const ruleHash = this.convertedSourceMap.get(ruleId);
            if (ruleHash !== undefined) {
                const [ruleFilterId, ruleIdx] = getHash(ruleHash);
                const filterName = this.filtersNames.get(ruleFilterId);
                res.originalRuleTxt = getSourceRule(this.sourceFilters[ruleFilterId], ruleIdx);
                res.filterId = ruleFilterId;
                res.filterName = filterName;
            }

            return res;
        }

        // Static filters
        const filterId = Number.parseInt(filterIdString.slice(RULESET_NAME.length), 10);

        const declarativeRule = this.filters[filterId]?.find(({ id }) => id === ruleId);
        const res = {
            declarativeRuleJson: JSON.stringify(declarativeRule, null, 4),
        } as RuleInfo;

        const convertedInfo = this.convertedSourceMaps.get(filterId);
        if (convertedInfo) {
            const ruleIdx = convertedInfo.get(ruleId) as HashOriginalRule;
            const filterName = this.filtersNames.get(filterId);
            res.originalRuleTxt = getSourceRule(this.sourceFilters[filterId], ruleIdx);
            res.filterId = filterId;
            // TODO: Get rid of the message evaluation key at runtime
            res.filterName = filterName
                ? translator.getMessage(filterName)
                : '';
        }

        return res;
    };

    private addNewRecord = (record: chrome.declarativeNetRequest.MatchedRuleInfoDebug) => {
        const { request, rule } = record;
        const { rulesetId, ruleId } = rule;
        const {
            frameId,
            initiator,
            method,
            requestId,
            tabId,
            type,
            url,
        } = request;

        const {
            originalRuleTxt,
            filterName,
            filterId,
            declarativeRuleJson,
        } = this.getRuleInfo(rulesetId, ruleId);

        this.collected.push({
            ruleId,
            rulesetId,
            frameId,
            initiator,
            method,
            requestId,
            tabId,
            type,
            url,
            originalRuleTxt,
            filterName,
            filterId,
            declarativeRuleJson,
        });
    };

    public start = async (convertedSourceMap: FilterConvertedSourceMap) => {
        this.isCollecting = true;
        await storage.set(IS_COLLECTING_LOG, true);
        await this.init(convertedSourceMap);
        onRuleMatchedDebug.addListener(this.addNewRecord);
    };

    // TODO: Needs to clean collected log after stop or not?
    public stop = async () => {
        this.isCollecting = false;
        await storage.set(IS_COLLECTING_LOG, false);
        onRuleMatchedDebug.removeListener(this.addNewRecord);
    };

    public getCollected = (): RecordFiltered[] => {
        // To display newer requests on the top
        const reverseOrderRuleLog = [];
        for (let i = this.collected.length - 1; i >= 0; i -= 1) {
            reverseOrderRuleLog.push(this.collected[i]);
        }
        const collected = JSON.parse(JSON.stringify(reverseOrderRuleLog)) as RecordFiltered[];
        this.collected = [];
        return collected;
    };
}

export const filteringLog = new FilteringLog();
