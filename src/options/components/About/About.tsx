import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import { theme } from 'Common/styles';
import cn from 'classnames';
import { LEARN_MORE_URL } from 'Common/constants/common';
import styles from './About.module.pcss';

export const About = () => {
    return (
        <section className={styles.container}>
            <h2 className={cn(theme.common.headingMain, styles.title)}>
                {reactTranslator.getMessage('options_about_title')}
            </h2>
            <h3 className={cn(theme.common.headingSecondary, styles.version)}>
                {`${reactTranslator.getMessage('options_about_version')} ${chrome.runtime.getManifest().version} `}
                {reactTranslator.getMessage('options_about_nightly')}
            </h3>
            <div className={styles.section}>
                {reactTranslator.getMessage('options_about_latest_version')}
            </div>
            <div className={styles.readMoreSection}>
                <a
                    href={LEARN_MORE_URL}
                    className={cn(theme.common.link, styles.readMoreLink)}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {reactTranslator.getMessage('options_about_read_more')}
                </a>
            </div>
            <div className={styles.section}>{`2009-${new Date().getFullYear()} AdGuard Software Ltd.`}</div>
            <div className={styles.section}>
                {reactTranslator.getMessage('options_about_rights_reserved')}
            </div>
        </section>
    );
};
