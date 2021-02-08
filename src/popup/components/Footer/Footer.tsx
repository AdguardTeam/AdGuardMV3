import React, { useContext } from 'react';

import { Icon } from 'Common/components/ui/Icon';
import { reactTranslator } from 'Common/translators/reactTranslator';

import { observer } from 'mobx-react';
import cn from 'classnames';
import { theme } from 'Common/styles';
import { rootStore } from '../../stores';

import styles from './Footer.module.pcss';

export const Footer = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled } = settingsStore;

    const className = cn(styles.footer, {
        [styles.footerDisabled]: !protectionEnabled,
    });

    return (
        <footer className={className}>
            <span className={theme.common.textRegular}>
                {reactTranslator.getMessage('options_works_with_v3', {
                    span: (payload: string) => (
                        <span className={theme.common.textBold}>
                            {payload}
                        </span>
                    ),
                })}
            </span>
            <Icon id="chrome_logo" className={styles.footerLogo} />
        </footer>
    );
});
