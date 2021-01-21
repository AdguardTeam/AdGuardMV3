import React from 'react';
import { Icon } from '../../../common/components/ui/Icon';

import './footer.pcss';

// FIXME add to _locales
export const Footer = () => {
    return (
        <footer className="footer">
            <span className="text text__regular">
                Works with
                &nbsp;
                <span className="text text__bold">V3</span>
                &nbsp;
                Manifest
            </span>
            <Icon id="chrome_logo" className="logo" />
        </footer>
    );
};
