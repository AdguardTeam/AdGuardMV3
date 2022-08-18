import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icon, IconId } from 'Common/components/ui';

import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';

import styles from './switcher.module.pcss';

interface SwitcherProps {
    disabled?: boolean,
}

export const Switcher = observer(({ disabled }: SwitcherProps) => {
    const { settingsStore } = useContext(rootStore);
    const {
        toggleAllowlisted, isAllowlisted, isWebSiteTab,
    } = settingsStore;

    const onClick = async () => {
        await toggleAllowlisted();
        await sender.reloadActiveTab();
    };

    const icon = isAllowlisted ? IconId.CIRCLE : IconId.CHECKMARK;

    const className = cn(styles.switcher, {
        [styles.disabled]: isAllowlisted,
        [styles.noActive]: disabled || !isWebSiteTab,
    });

    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
        >
            <div className={styles.center} />
            <div className={styles.btn}>
                <Icon id={icon} className={styles.icon} />
            </div>
        </button>
    );
});
