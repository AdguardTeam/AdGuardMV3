import React, { useContext } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';

import { rootStore } from '../../stores';

import styles from './PageInfo.module.pcss';

export const PageInfo = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        refreshPage,
        currentSite,
        protectionPauseExpiresSec,
        refreshAfterResumeProtection,
        isAllowlisted,
        isWebSiteTab,
    } = settingsStore;

    const getProtectionStatusMessage = (
        filteringEnabled: boolean,
        protectionPauseExpired: boolean,
        securePage: boolean,
    ) => {
        if (securePage) {
            return reactTranslator.getMessage('popup_protection_secure_page');
        }
        if (protectionPauseExpired) {
            return reactTranslator.getMessage(
                'popup_protection_enabled_refresh',
                {
                    button: (payload: string) => (
                        <button
                            type="button"
                            className={styles.refreshButton}
                            onClick={refreshPage}
                        >
                            {payload}
                        </button>
                    ),
                },
            );
        }
        if (filteringEnabled) {
            return reactTranslator.getMessage('popup_protection_enabled_status');
        }
        return reactTranslator.getMessage('popup_protection_disabled_status');
    };

    const message = getProtectionStatusMessage(
        !isAllowlisted,
        refreshAfterResumeProtection && protectionPauseExpiresSec === 0,
        !isWebSiteTab,
    );

    const className = cn(styles.mainSection, {
        [styles.sectionDisabled]: isAllowlisted,
    });

    return (
        <section className={className}>
            <h1 className={theme.common.pageInfoMain}>{currentSite}</h1>
            <h6 className={theme.common.pageInfoAdditional}>
                {message}
            </h6>
        </section>
    );
});
