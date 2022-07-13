import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import { theme } from 'Common/styles';
import cn from 'classnames';
import {
    ACKNOWLEDGMENTS,
    DISCUSS,
    GITHUB,
    PRIVACY,
    WEBSITE,
} from 'Common/constants/urls';
import styles from './About.module.pcss';

const linkList = [
    {
        href: PRIVACY,
        label: reactTranslator.getMessage('options_privacy_policy'),
    },
    {
        href: WEBSITE,
        label: reactTranslator.getMessage('options_site'),
    },
    {
        href: DISCUSS,
        label: reactTranslator.getMessage('options_discuss'),
    },
    {
        href: ACKNOWLEDGMENTS,
        label: reactTranslator.getMessage('options_acknowledgment'),
    },
    {
        href: GITHUB,
        label: reactTranslator.getMessage('options_github'),
    },
];

export const About = () => {
    return (
        <section className={styles.container}>
            <h2 className={cn(theme.common.headingMain, styles.title)}>
                {reactTranslator.getMessage('options_about_title')}
            </h2>
            <div className={cn(theme.common.headingSecondary, styles.description)}>
                <div>
                    {reactTranslator.getMessage('options_about_product')}
                </div>
                <div>
                    {`${reactTranslator.getMessage('options_about_version')} ${chrome.runtime.getManifest().version} `}
                </div>
            </div>
            <div className={cn(theme.common.headingSecondary, styles.description)}>
                <div>
                    {`© 2009-${new Date().getFullYear()} AdGuard Software Ltd.`}
                </div>
                <div>
                    {reactTranslator.getMessage('options_about_rights_reserved')}
                </div>
            </div>
            <div className={styles.readMoreSection}>
                { linkList.map(({ href, label }) => (
                    <div className={styles.readMoreLinkWrapper} key={href}>
                        <a
                            href={href}
                            className={cn(theme.common.link, styles.readMoreLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {label}
                        </a>
                    </div>
                )) }
            </div>
        </section>
    );
};
