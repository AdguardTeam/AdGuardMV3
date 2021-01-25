import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import './about.pcss';

// TODO add links to tds
const READ_MORE_LINK = 'https://adguard.com';
const ADGUARD_SITE_LINK = 'https://adguard.com';

export const About = () => {
    return (
        <section className="about">
            <h2 className="heading heading__main">{reactTranslator.getMessage('options_about_title')}</h2>
            <h3 className="heading heading__secondary about__version">{`${reactTranslator.getMessage('options_about_version')} ${chrome.runtime.getManifest().version}`}</h3>
            <div className="about__section">Placeholder</div>
            <div className="about__section read-more__section">
                <a href={READ_MORE_LINK} className="link read-more__link">{reactTranslator.getMessage('options_about_read_more')}</a>
            </div>
            <div className="about__section">{`2009-${new Date().getFullYear()} AdGuard Software Ltd.`}</div>
            <div className="about__section">
                {reactTranslator.getMessage('options_about_rights_reserved')}
                &nbsp;
                <a href={ADGUARD_SITE_LINK} className="link">adguard.com</a>
            </div>
        </section>
    );
};
