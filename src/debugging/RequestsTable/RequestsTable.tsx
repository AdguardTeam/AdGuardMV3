import React from 'react';
import cn from 'classnames';
import { RecordFiltered } from '@adguard/tswebextension/mv3';

import { translator } from 'Common/translators/translator';
import { FiltersNames } from 'background/filters';

import style from './requests-table.module.pcss';

type RequestsTableProps = {
    ruleLog: RecordFiltered[],
    filtersNames: FiltersNames,
    cleanLog: () => void,
};

export const RequestsTable = ({
    ruleLog,
    filtersNames,
    cleanLog,
}: RequestsTableProps) => {
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

    const getTableHeader = (titlesArr: string[]) => {
        return (
            <div className={cn(style.row, style.rowHead)}>
                {titlesArr.map((title) => (
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
            sourceRules,
            declarativeRuleJson,
        } = record;

        const sourceRulesTxt = sourceRules.map(({ sourceRule, filterId }) => {
            const filterName = filtersNames[filterId] || 'not_found';

            return (
                <p>
                    {`Rule "${sourceRule}" from filter "${filterName}" with id ${filterId}`}
                </p>
            );
        });

        const formattedJson = declarativeRuleJson
            ? JSON.stringify(JSON.parse(declarativeRuleJson), null, '\t')
            : '';

        return (
            <div className={style.row} key={requestId}>
                <div className={style.cell}>{ruleId}</div>
                <div className={style.cell}>{rulesetId}</div>
                <div className={style.cell}>{frameId}</div>
                <div className={style.cell}>{initiator}</div>
                <div className={style.cell}>{method}</div>
                <div className={style.cell}>{requestId}</div>
                <div className={style.cell}>{tabId}</div>
                <div className={style.cell}>{type}</div>
                <div className={style.cell}>{url}</div>
                <div className={style.cell}>{sourceRulesTxt}</div>
                <div className={style.cell}>
                    <pre>
                        {formattedJson}
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
                    {getTableHeader(titles)}
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
