import React from 'react';
import { Icon, ICON_ID } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';

import styles from './Footer.module.pcss';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <span className={theme.common.textRegular}>
                {reactTranslator.getMessage('options_works_with_v3', {
                    span: (payload: string) => (
                        <span className={theme.common.textBold}>
                            {payload}
                        </span>
                    ),
                })}
            </span>
            <Icon id={ICON_ID.CHROME_LOGO} className={styles.footerLogo} />
        </footer>
    );
};
