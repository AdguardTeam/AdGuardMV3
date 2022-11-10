import React, { useState, useEffect } from 'react';
import { ExtendedMV3MessageType, RecordFiltered } from '@adguard/tswebextension/mv3';

import { translator } from 'Common/translators/translator';
import { sendInnerMessage, sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES } from 'Common/constants/common';
import { FiltersNames } from 'background/filters';

import { RequestsTable } from '../RequestsTable';

const UPDATE_LOG_INTERVAL_MS = 1000;

export const DebuggingApp = () => {
    const [ruleLog, setRuleLog] = useState<RecordFiltered[]>([]);
    const [filtersNames, setFiltersNames] = useState<FiltersNames>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isActive = true;
        let timer: number;

        const updateFiltersNames = async () => {
            const filtersNamesMessage = await sendMessage<FiltersNames>(MESSAGE_TYPES.GET_FILTERS_NAMES);
            setFiltersNames(filtersNamesMessage);
        };

        const startAndUpdate = async () => {
            try {
                await sendMessage(MESSAGE_TYPES.START_LOG);
                await updateFiltersNames();
            } catch (e) {
                setIsError(true);
            }

            const fetchCollected = async () => {
                // To abort mutate state on unmounted component
                if (!isActive) {
                    clearInterval(timer);
                    return;
                }
                try {
                    const collected = await sendInnerMessage<RecordFiltered[]>(ExtendedMV3MessageType.GetCollectedLog);
                    await updateFiltersNames();
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
                filtersNames={filtersNames}
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
