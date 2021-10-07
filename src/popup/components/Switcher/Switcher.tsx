import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icon, ICON_ID } from 'Common/components/ui';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';

import styles from './switcher.module.pcss';

export const Switcher = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { filteringEnabled, setSetting } = settingsStore;

    const onClick = async () => {
        await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, !filteringEnabled);
        await sender.reloadActiveTab();
    };

    const icon = filteringEnabled ? ICON_ID.CHECKMARK : ICON_ID.CIRCLE;

    const className = cn(styles.switcher, {
        [styles.disabled]: !filteringEnabled,
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
