import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { Icon } from 'Common/components/ui/Icon';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { ICON_ID } from 'Common/components/ui/Icons';
import { rootStore } from '../../stores';

import styles from './Footer.module.pcss';

export const Footer = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled, protectionPausedTimer } = settingsStore;

    const protectionDisabled = !protectionEnabled || protectionPausedTimer > 0;

    const className = cn(styles.footer, {
        [styles.footerDisabled]: protectionDisabled,
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
            <Icon id={ICON_ID.CHROME_LOGO} className={styles.footerLogo} />
        </footer>
    );
});
