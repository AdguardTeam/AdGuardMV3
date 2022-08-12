import { FilterConvertedSourceMap, USER_FILTER_ID, HashOriginalRule } from '@adguard/tswebextension/mv3';
import { DeclarativeConverter } from '@adguard/tsurlfilter';

import { NEW_LINE_SEPARATOR, RULESET_NAME } from 'Common/constants/common';
import { ADGUARD_FILTERS_IDS } from 'Common/constants/filters';
import { arrayToMap } from 'Common/utils/arrays';

import { COMMON_FILTERS_DIR } from './backend';
import { CUSTOM_FILTERS_START_ID, filters } from './filters';
import { tsWebExtensionWrapper } from './tswebextension';
import { userRules } from './userRules';

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

    private sourceFilters: string[] = [];

    private convertedSourceMaps: ConvertedSourceMaps = new Map();

    private filters: chrome.declarativeNetRequest.Rule[][] = [];

    // Load converted declarative json rules
    private getFilterDeclarative = async (id: number) => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/declarative/filter_${id}.json`);
        const file = await fetch(url);
        this.filters[id] = await file.json() as chrome.declarativeNetRequest.Rule[];
    };

    // Load original filters
    private getFilterSourceRules = async (id: number) => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${id}.txt`);
        const file = await fetch(url);
        this.sourceFilters[id] = await file.text();
    };

    // Load dictionary of converted rules
    private getFilterSourceMap = async (id: number) => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${id}.json.map`);
        const file = await fetch(url);
        const arr = await file.json() as Array<Array<number>>;
        this.convertedSourceMaps.set(id, arrayToMap(arr));
    };

    // TODO: Update dynamic rules after configure tswebextension
    // Collect info about static, custom filters and user rules
    private collectRulesInfo = async () => {
        this.convertedSourceMap = tsWebExtensionWrapper.convertedSourceMap;
        this.filters[USER_FILTER_ID] = await chrome.declarativeNetRequest.getDynamicRules();
        filters.rules
            .filter(({ id }) => id >= CUSTOM_FILTERS_START_ID)
            .forEach(({ id, rules }) => {
                this.sourceFilters[id] = rules;
            });
        this.sourceFilters[USER_FILTER_ID] = await userRules.getRules();

        this.filtersNames = new Map(filters.filters.map(({ id, title }) => [id, title]));
        this.filtersNames.set(USER_FILTER_ID, 'userrules');
    };

    private init = async () => {
        const requests = ADGUARD_FILTERS_IDS
            .map(async ({ id }) => Promise.all([
                this.getFilterDeclarative(id),
                this.getFilterSourceRules(id),
                this.getFilterSourceMap(id),
            ]));

        await Promise.all(requests);
        await this.collectRulesInfo();
    };

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
            res.filterName = filterName;
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

    public start = async () => {
        await this.init();
        onRuleMatchedDebug.addListener(this.addNewRecord);
    };

    public stop = () => {
        onRuleMatchedDebug.removeListener(this.addNewRecord);
    };

    public getCollected = (): RecordFiltered[] => {
        const collected = JSON.parse(JSON.stringify(this.collected)) as RecordFiltered[];
        this.collected = [];
        return collected;
    };
}

export const filteringLog = new FilteringLog();
