import React, { useState, useEffect, useRef } from 'react';

import { MESSAGE_TYPES } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { RecordFiltered } from 'background/filtering-log';

import { RequestsTable } from '../RequestsTable';
import { sendMessage } from '../../common/helpers';

const UPDATE_LOG_INTERVAL_MS = 3000;

export const DebuggingApp = () => {
    const [ruleLog, setRuleLog] = useState<RecordFiltered[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const crawlerTimer: { current: NodeJS.Timeout | null } = useRef(null);

    useEffect(() => {
        sendMessage(MESSAGE_TYPES.START_LOG);

        const fetchCollected = async () => {
            setIsLoading(true);

            try {
                const collected = await sendMessage<RecordFiltered[]>(MESSAGE_TYPES.GET_COLLECTED_LOG);
                // TODO: drop focus on repaint
                setRuleLog((items) => items.concat(collected));
            } catch (e) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        crawlerTimer.current = setInterval(fetchCollected, UPDATE_LOG_INTERVAL_MS);
        fetchCollected();

        return () => {
            clearInterval(crawlerTimer.current as NodeJS.Timeout);
            sendMessage(MESSAGE_TYPES.STOP_LOG);
        };
    }, []);

    const content = isLoading
        ? <h1>{translator.getMessage('debugging_loading_sourcemap')}</h1>
        : (
            <RequestsTable
                ruleLog={ruleLog}
                cleanLog={() => setRuleLog(() => [])}
            />
        );

    return (
        <section>
            {
                isError
                    ? translator.getMessage('debugging_title_reload_page')
                    : content
            }
        </section>
    );
};
