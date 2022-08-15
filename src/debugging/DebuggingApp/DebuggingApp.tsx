import React, { useState, useEffect } from 'react';

import { MESSAGE_TYPES } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { RecordFiltered } from 'background/filtering-log';
import { sendMessage } from 'Common/helpers';

import { RequestsTable } from '../RequestsTable';

const UPDATE_LOG_INTERVAL_MS = 1000;

export const DebuggingApp = () => {
    const [ruleLog, setRuleLog] = useState<RecordFiltered[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isActive = true;
        let timer: number;

        const startAndUpdate = async () => {
            await sendMessage(MESSAGE_TYPES.START_LOG);

            const fetchCollected = async () => {
                // To abort mutate state on unmounted component
                if (!isActive) {
                    clearInterval(timer);
                    return;
                }
                try {
                    const collected = await sendMessage<RecordFiltered[]>(MESSAGE_TYPES.GET_COLLECTED_LOG);
                    // TODO: drop focus on repaint
                    setRuleLog((items) => items.concat(collected));
                } catch (e) {
                    setIsError(true);
                }
            };

            await fetchCollected();
            timer = window.setInterval(fetchCollected, UPDATE_LOG_INTERVAL_MS);
            setIsLoading(false);
        };

        startAndUpdate();

        return () => {
            isActive = false;

            clearInterval(timer);
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
