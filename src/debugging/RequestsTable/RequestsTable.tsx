import { FilterConvertedSourceMap, HashOriginalRule, USER_FILTER_ID } from '@adguard/tswebextension/mv3';
import { DeclarativeConverter } from '@adguard/tsurlfilter';

import React from 'react';
import cn from 'classnames';
import { RULESET_NAME, NEW_LINE_SEPARATOR } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';

import type { ConvertedSourceMaps } from '../DebuggingApp';

import style from './requests-table.module.pcss';

type RequestsTableType = {
    ruleLog: chrome.declarativeNetRequest.MatchedRuleInfoDebug[],
    filters: chrome.declarativeNetRequest.Rule[][],
    filtersNames: Map<number, string>,
    sourceFilters: string[],
    convertedDynamicRulesSourceMap: FilterConvertedSourceMap,
    convertedSourceMaps: ConvertedSourceMaps,
    cleanLog: () => void,
};

type RuleInfo = {
    originalRuleTxt?: string,
    filterName?: string,
    filterId?: number,
    declarativeRuleJson: chrome.declarativeNetRequest.Rule,
};

export const RequestsTable = ({
    ruleLog,
    filters,
    filtersNames,
    sourceFilters,
    convertedDynamicRulesSourceMap,
    convertedSourceMaps,
    cleanLog,
}: RequestsTableType) => {
    const titles = [
        'Rule ID',
        'Ruleset ID',
        'Frame ID',
        'Initiator',
        'Method',
        'Request ID',
        'Tab ID',
        'Type',
        'URL',
        'Original rule',
        'JSON Rule',
    ];

    const getRuleInfo = (filterIdString: string, ruleId: number): RuleInfo => {
        const getHash = (n: number) => DeclarativeConverter.storageIdxToRuleListIdx(n);
        const getSourceRule = (filterContent: string, ruleIdx: number) => {
            return filterContent.slice(
                ruleIdx,
                filterContent.indexOf(NEW_LINE_SEPARATOR, ruleIdx),
            );
        };

        if (filterIdString === chrome.declarativeNetRequest.DYNAMIC_RULESET_ID) {
            const res = {
                declarativeRuleJson: filters[USER_FILTER_ID].find(({ id }) => id === ruleId),
            } as RuleInfo;

            const ruleHash = convertedDynamicRulesSourceMap.get(ruleId);
            if (ruleHash !== undefined) {
                const [ruleFilterId, ruleIdx] = getHash(ruleHash);
                const filterName = filtersNames.get(ruleFilterId);
                res.originalRuleTxt = getSourceRule(sourceFilters[ruleFilterId], ruleIdx);
                res.filterId = ruleFilterId;
                res.filterName = filterName;
            }

            return res;
        }

        const filterId = Number.parseInt(filterIdString.slice(RULESET_NAME.length), 10);

        const res = {
            declarativeRuleJson: filters[filterId]?.find(({ id }) => id === ruleId),
        } as RuleInfo;

        const convertedInfo = convertedSourceMaps.get(filterId);
        if (convertedInfo) {
            const ruleIdx = convertedInfo.get(ruleId) as HashOriginalRule;
            const filterName = filtersNames.get(filterId);
            res.originalRuleTxt = getSourceRule(sourceFilters[filterId], ruleIdx);
            res.filterId = filterId;
            res.filterName = filterName;
        }

        return res;
    };

    const getActionsBlock = () => {
        return (
            <div className={style.header}>
                {ruleLog.length > 0 ? (
                    <button
                        type="button"
                        onClick={cleanLog}
                    >
                        Clean
                    </button>
                ) : (
                    <div className={style.title}>
                        {translator.getMessage('debugging_title_reload_page')}
                    </div>
                )}
            </div>
        );
    };

    const getTableHeader = () => {
        return (
            <div className={cn(style.row, style.rowHead)}>
                {titles.map((title) => (
                    <div key={title} className={style.cell}>
                        {title}
                    </div>
                ))}
            </div>
        );
    };

    const getTableBodyLine = (matchedRule: chrome.declarativeNetRequest.MatchedRuleInfoDebug) => {
        const { request, rule } = matchedRule;
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
        } = getRuleInfo(rulesetId, ruleId);

        return (
            <div className={style.row} key={`${rulesetId}_${ruleId}_${requestId}`}>
                <div className={style.cell}>{ruleId}</div>
                <div className={style.cell}>{rulesetId}</div>
                <div className={style.cell}>{frameId}</div>
                <div className={style.cell}>{initiator}</div>
                <div className={style.cell}>{method}</div>
                <div className={style.cell}>{requestId}</div>
                <div className={style.cell}>{tabId}</div>
                <div className={style.cell}>{type}</div>
                <div className={style.cell}>{url}</div>
                <div className={style.cell}>
                    <p>
                        {originalRuleTxt}
                        <br />
                        {`from filter ${filterName} (id - ${filterId})`}
                    </p>
                </div>
                <div className={style.cell}>
                    <pre>
                        {JSON.stringify(declarativeRuleJson, null, 4)}
                    </pre>
                </div>
            </div>
        );
    };

    const getTable = () => {
        return (
            <>
                {getActionsBlock()}

                <div className={style.wrapper}>
                    {getTableHeader()}
                    {ruleLog.map((i) => getTableBodyLine(i))}
                </div>
            </>
        );
    };

    return (
        <div className={style.container}>
            { getTable() }
        </div>
    );
};
