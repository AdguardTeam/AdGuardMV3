import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icon, IconId } from 'Common/components/ui';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';

import styles from './switcher.module.pcss';

interface SwitcherProps {
    disabled?: boolean,
}

export const Switcher = observer(({ disabled }: SwitcherProps) => {
    const { settingsStore } = useContext(rootStore);
    const { filteringEnabled, setSetting } = settingsStore;

    const onClick = async () => {
        await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, !filteringEnabled);
        await sender.reloadActiveTab();
    };

    const icon = filteringEnabled ? IconId.CHECKMARK : IconId.CIRCLE;

    const className = cn(styles.switcher, {
        [styles.disabled]: !filteringEnabled,
        [styles.noActive]: disabled,
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
