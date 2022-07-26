import React from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { DOWNLOAD_APP } from 'Common/constants/urls';

import styles from './Warning.module.pcss';

type WarningProps = {
    nowEnabled: string,
    wasEnabled: string,
    onClickReactivateFilters: () => void,
    onClickCloseWarning: () => void,
};

export const Warning = ({
    nowEnabled,
    wasEnabled,
    onClickReactivateFilters,
    onClickCloseWarning,
}: WarningProps) => {
    const content = [
        {
            id: 1,
            title: reactTranslator.getMessage('options_limits_warning_title'),
        },
        {
            id: 2,
            title: reactTranslator.getMessage('options_limits_warning_title_what_happened'),
            desc: reactTranslator.getMessage('options_limits_warning_desc_what_happened'),
        },
        {
            id: 3,
            title: reactTranslator.getMessage('options_limits_warning_title_filters_enabled'),
            desc: wasEnabled,
        },
        {
            id: 4,
            title: reactTranslator.getMessage('options_limits_warning_title_filters_enabled_now'),
            desc: nowEnabled,
        },
        {
            id: 5,
            title: reactTranslator.getMessage('options_limits_warning_title_possible_actions'),
            desc: reactTranslator.getMessage(
                'options_limits_warning_desc_possible_actions',
                // TODO fix url
                {
                    button: (payload: string) => (
                        <button
                            className={theme.button.link}
                            type="button"
                            onClick={onClickReactivateFilters}
                        >
                            {payload}
                        </button>
                    ),
                },
            ),
        },
        {
            id: 6,
            desc: reactTranslator.getMessage(
                'options_limits_warning_desc_app',
                {
                    link: (payload: string) => (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={DOWNLOAD_APP}
                            className={theme.button.link}
                        >
                            {payload}
                        </a>
                    ),
                },
            ),
        },
        {
            id: 7,
            desc: reactTranslator.getMessage(
                'options_limits_warning_desc_close', {
                    button: (payload: string) => (
                        <button
                            className={theme.button.link}
                            type="button"
                            onClick={onClickCloseWarning}
                        >
                            {payload}
                        </button>
                    ),
                },
            ),
        },
    ];

    return (
        <div className={styles.block}>
            {content.map((item) => (
                <div key={item.id} className={styles.paragraph}>
                    {item.title && (
                        <div className={styles.title}>
                            {item.title}
                        </div>
                    )}
                    {item.desc && (
                        <div className={styles.desc}>
                            {item.desc}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
