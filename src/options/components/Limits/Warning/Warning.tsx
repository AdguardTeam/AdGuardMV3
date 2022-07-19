import React from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';

import styles from './Warning.module.pcss';

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
        desc: reactTranslator.getMessage('options_limits_warning_desc_filters_enabled'),
    },
    {
        id: 4,
        title: reactTranslator.getMessage('options_limits_warning_title_filters_enabled_now'),
        desc: reactTranslator.getMessage('options_limits_warning_desc_filters_enabled_now'),
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
                        // TODO add handle
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
            // TODO fix url
            {
                link: (payload: string) => (
                    <a
                        // TODO fix url
                        // eslint-disable-next-line max-len
                        href="https://adguard.com/forward.html?action=compare&from=options_screen&app=browser_extension_mv3"
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
                        // TODO add handle
                    >
                        {payload}
                    </button>
                ),
            },
        ),
    },
];

export const Warning = () => (
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
