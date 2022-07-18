import React, { useState, useEffect } from 'react';
import { FilterConvertedSourceMap, USER_FILTER_ID } from '@adguard/tswebextension/mv3';

import type { Rules } from 'Common/constants/common';
import { MESSAGE_TYPES, Filter } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { ADGUARD_FILTERS_IDS } from 'Common/constants/filters';

import { RequestsTable } from '../RequestsTable';
import { COMMON_FILTERS_DIR } from '../../background/backend';
import { sendMessage } from '../../common/helpers';

const arrayToMap = (arr: Array<Array<number>>) => new Map(arr.map((i) => [i[0], i[1]]));

export type FilterId = number;
export type ConvertedSourceMaps = Map<FilterId, FilterConvertedSourceMap>;

type DebugInfo = {
    convertedSourceMap: Array<Array<number>>,
    customFilters: Rules[],
    userRules: string,
    currentDeclarativeRules: chrome.declarativeNetRequest.Rule[],
    filtersInfo: Filter[],
};

export const DebuggingApp = () => {
    const [ruleLog, setRuleLog] = useState<chrome.declarativeNetRequest.MatchedRuleInfoDebug[]>([]);
    const [filters, setFilters] = useState<chrome.declarativeNetRequest.Rule[][]>([]);
    const [filtersNames, setFiltersNames] = useState<Map<number, string>>(new Map());
    const [sourceFilters, setSourceFilters] = useState<string[]>([]);
    const [
        convertedDynamicRulesSourceMap,
        setConvertedDynamicRulesSourceMap,
    ] = useState<FilterConvertedSourceMap>(new Map());
    const [convertedSourceMaps, setConvertedSourceMaps] = useState<ConvertedSourceMaps>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    const newLog = new Set(ruleLog);
    const setNewRuleLog = (i: chrome.declarativeNetRequest.MatchedRuleInfoDebug) => {
        newLog.add(i);
        setRuleLog(Array.from(newLog));
    };

    useEffect(() => {
        // Getting filter names and information about dynamic rules
        const fetchRulesInfo = async () => {
            const {
                convertedSourceMap,
                customFilters,
                userRules,
                currentDeclarativeRules,
                filtersInfo,
            } = await sendMessage<DebugInfo>(MESSAGE_TYPES.GET_DEBUG_INFO);

            // O(n) for deserialize to map
            setConvertedDynamicRulesSourceMap(arrayToMap(convertedSourceMap));

            customFilters.forEach(({ id, rules }) => {
                sourceFilters[id] = rules;
            });
            sourceFilters[USER_FILTER_ID] = userRules;
            setSourceFilters(sourceFilters);

            filters[USER_FILTER_ID] = currentDeclarativeRules;
            setFilters(filters);

            const filtersNamesMap = new Map(filtersInfo.map(({ id, title }) => [id, title]));
            filtersNamesMap.set(USER_FILTER_ID, 'userrules');
            setFiltersNames(filtersNamesMap);

            setIsLoading(false);
        };
        fetchRulesInfo();

        // Load converted declarative json rules
        const getFilterDeclarative = async (id: number) => {
            const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/declarative/filter_${id}.json`);
            const file = await fetch(url);
            filters[id] = await file.json() as chrome.declarativeNetRequest.Rule[];
            setFilters(filters);
        };

        // Load original filters
        const getFilterSourceRules = async (id: number) => {
            const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${id}.txt`);
            const file = await fetch(url);
            sourceFilters[id] = await file.text();
            setSourceFilters(sourceFilters);
        };

        // Load dictionary of converted rules
        const getFilterSourceMap = async (id: number) => {
            const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${id}.json.map`);
            const file = await fetch(url);
            const arr = await file.json() as Array<Array<number>>;
            convertedSourceMaps.set(id, arrayToMap(arr));
            setConvertedSourceMaps(convertedSourceMaps);
        };

        ADGUARD_FILTERS_IDS
            .forEach(async ({ id }) => {
                await Promise.all([
                    getFilterDeclarative(id),
                    getFilterSourceRules(id),
                    getFilterSourceMap(id),
                ]);
            });
    }, []);

    useEffect(() => {
        chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(setNewRuleLog);
        return () => {
            chrome.declarativeNetRequest.onRuleMatchedDebug.removeListener(setNewRuleLog);
        };
    }, []);

    return (
        <section>
            { isLoading && (<h1>{translator.getMessage('debugging_loading_sourcemap')}</h1>) }
            { !isLoading && (
                <RequestsTable
                    ruleLog={ruleLog}
                    filters={filters}
                    filtersNames={filtersNames}
                    sourceFilters={sourceFilters}
                    convertedDynamicRulesSourceMap={convertedDynamicRulesSourceMap}
                    convertedSourceMaps={convertedSourceMaps}
                    cleanLog={() => setRuleLog([])}
                />
            ) }
        </section>
    );
};
