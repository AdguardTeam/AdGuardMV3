import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import { theme } from 'Common/styles';
import cn from 'classnames';
import styles from './About.module.pcss';

// TODO add links to tds
const READ_MORE_LINK = 'https://adguard.com';
const ADGUARD_SITE_LINK = 'https://adguard.com';

export const About = () => {
    return (
        <section className={styles.container}>
            <h2 className={cn(theme.common.headingMain, styles.title)}>{reactTranslator.getMessage('options_about_title')}</h2>
            <h3 className={cn(theme.common.headingSecondary, styles.version)}>{`${reactTranslator.getMessage('options_about_version')} ${chrome.runtime.getManifest().version}`}</h3>
            <div className={styles.section}>Placeholder</div>
            <div className={styles.readMoreSection}>
                <a
                    href={READ_MORE_LINK}
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
                &nbsp;
                <a
                    href={ADGUARD_SITE_LINK}
                    className={styles.link}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    adguard.com
                </a>
            </div>
        </section>
    );
};
