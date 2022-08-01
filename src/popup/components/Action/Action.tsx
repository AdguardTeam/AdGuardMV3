import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';

import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';
import { theme } from '../../../common/styles';

import styles from './action.module.pcss';

export const Action = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { isAllowlisted } = settingsStore;

    const blockedAdsCount = 354; // TODO replace with real number

    const reportSiteClickHandler = async () => {
        await sender.reportSite('popup');
    };

    if (!isAllowlisted) {
        return (
            <section className={styles.container}>
                <h1 className={styles.counter}>{blockedAdsCount}</h1>
                <h6 className={styles.text}>
                    {reactTranslator.getMessage('popup_blocked_on_this_page')}
                </h6>
            </section>
        );
    }

    return (
        <button type="button" className={theme.common.actionButton} onClick={reportSiteClickHandler}>
            {reactTranslator.getMessage('popup_report_site_option')}
        </button>
    );
});
