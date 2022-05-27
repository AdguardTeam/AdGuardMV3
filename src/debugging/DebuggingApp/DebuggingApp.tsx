import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { translator } from 'Common/translators/translator';
import style from './debugging.module.pcss';

export const DebuggingApp = () => {
    const [ruleLog, setRuleLog] = useState<chrome.declarativeNetRequest.MatchedRuleInfoDebug[]>([]);

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
    ];

    const newLog = new Set(ruleLog);

    const setNewRuleLog = (i: chrome.declarativeNetRequest.MatchedRuleInfoDebug) => {
        newLog.add(i);
        setRuleLog([...newLog]);
    };

    useEffect(() => {
        chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(setNewRuleLog);
        return () => {
            chrome.declarativeNetRequest.onRuleMatchedDebug.removeListener(setNewRuleLog);
        };
    }, []);

    return (
        <div>
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
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
