import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

export const About = () => {
    return (<h2>{reactTranslator.getMessage('options_about_title')}</h2>);
};
