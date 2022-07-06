import React from 'react';
import cn from 'classnames';
import { MV3_URL } from 'Common/constants/common';
import { Icon, IconId } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';

import styles from './Footer.module.pcss';

export const Footer = () => {
    return (
        <a
            href={MV3_URL}
            target="_blank"
            className={styles.footer}
            rel="noreferrer"
        >
            <span className={cn(theme.common.textRegular, styles.text)}>
                {reactTranslator.getMessage('options_works_with_v3', {
                    span: (payload: string) => (
                        <span className={cn(theme.common.textBold, styles.textCenter)}>
                            {payload}
                        </span>
                    ),
                })}
            </span>
            <Icon id={IconId.CHROME_LOGO} className={styles.footerLogo} />
        </a>
    );
};
