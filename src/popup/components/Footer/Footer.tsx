import React from 'react';
import cn from 'classnames';
import { Icon, ICON_ID } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';

import styles from './Footer.module.pcss';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <span className={cn(theme.common.textRegular, styles.text)}>
                {reactTranslator.getMessage('options_works_with_v3', {
                    span: (payload: string) => (
                        <span className={cn(theme.common.textBold, styles.textCenter)}>
                            {payload}
                        </span>
                    ),
                })}
            </span>
            <Icon id={ICON_ID.CHROME_LOGO} className={styles.footerLogo} />
        </footer>
    );
};
