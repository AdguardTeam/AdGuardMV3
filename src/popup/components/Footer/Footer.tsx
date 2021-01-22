import React from 'react';

import { Icon } from '../../../common/components/ui/Icon';
import { reactTranslator } from '../../../common/translators/reactTranslator';

import './footer.pcss';

export const Footer = () => {
    return (
        <footer className="footer">
            <span className="text text__regular">
                {reactTranslator.getMessage('options_works_with_v3', {
                    span: (payload: string) => <span className="text text__bold">{payload}</span>,
                })}
            </span>
            <Icon id="chrome_logo" className="logo" />
        </footer>
    );
};
