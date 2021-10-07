import React, { useContext } from 'react';
import cn from 'classnames';

import { observer } from 'mobx-react';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';

import styles from './PageInfo.module.pcss';

type ProtectionStatusType = {
    key: string,
    params?: {
        [key: string]: (payload: string) => JSX.Element
    }
};

const PROTECTION_STATUS: { [key:string]: ProtectionStatusType } = {
    ENABLED: {
        key: 'popup_protection_enabled_status',
    },
    DISABLED: {
        key: 'popup_protection_disabled_status',
    },
    REFRESH_NEEDED: {
        key: 'popup_protection_enabled_refresh',
        params: {
            button: (payload: string) => (
                <button
                    type="button"
                    className={styles.refreshButton}
                    onClick={sender.reloadActiveTab}
                >
                    {payload}
                </button>
            ),
        },
    },
};

const getProtectionStatusProps = (
    filteringEnabled: boolean,
    protectionPauseExpired: boolean,
) => {
    if (protectionPauseExpired) {
        return PROTECTION_STATUS.REFRESH_NEEDED;
    }
    if (filteringEnabled) {
        return PROTECTION_STATUS.ENABLED;
    }
    return PROTECTION_STATUS.DISABLED;
};

export const PageInfo = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        filteringEnabled, currentSite, protectionPauseExpires, protectionPauseExpired,
    } = settingsStore;

    const {
        key,
        params,
    } = getProtectionStatusProps(
        filteringEnabled,
        protectionPauseExpires > 0 && protectionPauseExpired,
    );

    const className = cn(styles.mainSection, {
        [styles.sectionDisabled]: !filteringEnabled,
    });

    return (
        <section className={className}>
            <h1 className={theme.common.pageInfoMain}>{currentSite}</h1>
            <h6 className={theme.common.pageInfoAdditional}>
                {reactTranslator.getMessage(key, params)}
            </h6>
        </section>
    );
});
