import React from 'react';
import cn from 'classnames';

import { translator } from 'Common/translators/translator';
import { RecordFiltered } from 'background/filtering-log';

import style from './requests-table.module.pcss';

type RequestsTableType = {
    ruleLog: RecordFiltered[],
    cleanLog: () => void,
};

export const RequestsTable = ({
    ruleLog,
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

    const getTableBodyLine = (record: RecordFiltered) => {
        const {
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
        } = record;

        return (
            <div className={style.row} key={`${rulesetId}_${ruleId}_${requestId}_${url}`}>
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
                        <br />
                        {`from filter '${filterName}' with id - ${filterId}`}
                    </p>
                </div>
                <div className={style.cell}>
                    <pre>
                        {declarativeRuleJson}
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
