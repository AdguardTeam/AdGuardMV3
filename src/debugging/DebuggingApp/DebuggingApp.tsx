import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import { translator } from 'Common/translators/translator';
import { ADGUARD_FILTERS_IDS } from 'Common/constants/filters';

import { COMMON_FILTERS_DIR } from '../../background/backend';
import { RULESET_NAME } from '../../../scripts/build-constants';

import style from './debugging.module.pcss';

export const DebuggingApp = () => {
    const [ruleLog, setRuleLog] = useState<chrome.declarativeNetRequest.MatchedRuleInfoDebug[]>([]);
    const [filters, setFilters] = useState<chrome.declarativeNetRequest.Rule[][]>([]);

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
        'JSON Rule',
    ];

    const newLog = new Set(ruleLog);

    const setNewRuleLog = (i: chrome.declarativeNetRequest.MatchedRuleInfoDebug) => {
        newLog.add(i);
        setRuleLog(Array.from(newLog));
    };

    useEffect(() => {
        ADGUARD_FILTERS_IDS
            .forEach(async ({ id }) => {
                const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/declarative/filter_${id}.json`);
                const result = await fetch(url);
                const json = await result.json();
                const rules = json as chrome.declarativeNetRequest.Rule[];
                filters[id] = rules;
                setFilters(filters);
            });
    }, []);

    useEffect(() => {
        chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(setNewRuleLog);
        return () => {
            chrome.declarativeNetRequest.onRuleMatchedDebug.removeListener(setNewRuleLog);
        };
    }, []);

    return (
        <div className={style.container}>
            <div className={style.header}>
                {ruleLog.length > 0 ? (
                    <button
                        type="button"
                        onClick={() => { setRuleLog([]); }}
                    >
                        Clean
                    </button>
                ) : (
                    <div className={style.title}>
                        {translator.getMessage('debugging_title_reload_page')}
                    </div>
                )}
            </div>

            <div className={style.wrapper}>
                <div className={cn(style.row, style.rowHead)}>
                    {titles.map((title) => (
                        <div key={title} className={style.cell}>
                            {title}
                        </div>
                    ))}
                </div>

                {ruleLog.length > 0 && (
                    ruleLog.map((i) => {
                        const { request, rule } = i;
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

                        const filterId = Number.parseInt(rulesetId.slice(RULESET_NAME.length), 10);
                        const ruleInfo = filters[filterId]?.find(({ id }) => id === ruleId);

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
                                    <pre>
                                        {JSON.stringify(ruleInfo, null, 4)}
                                    </pre>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
