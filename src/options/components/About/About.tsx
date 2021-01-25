import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import './about.pcss';

const packageJson = require('../../../../package.json');

const { version } = packageJson;

const adguardSiteLink = 'https://adguard.com';

// TODO add links to tds
export const About = () => {
    return (
        <section className="about">
            <h2 className="heading heading__main">{reactTranslator.getMessage('options_about_title')}</h2>
            <h3 className="heading heading__secondary about__version">{`${reactTranslator.getMessage('options_about_version')} ${version}`}</h3>
            <div className="about__section">Placeholder</div>
            <div className="about__section read-more__section">
                <a href={adguardSiteLink} className="link read-more__link">{reactTranslator.getMessage('options_about_read_more')}</a>
            </div>
            <div className="about__section">{`2009-${new Date().getFullYear()} AdGuard Software Ltd.`}</div>
            <div className="about__section">
                {reactTranslator.getMessage('options_about_rights_reserved')}
                &nbsp;
                <a href={adguardSiteLink} className="link">adguard.com</a>
            </div>
        </section>
    );
};
