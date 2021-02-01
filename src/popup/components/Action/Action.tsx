import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';

import './action.pcss';

export const Action = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { filteringEnabled } = settingsStore;

    const blockedAdsCount = 354; // TODO replace with real number

    const onClick = async () => {
        await sender.reportSite();
    };

    if (filteringEnabled) {
        return (
            <section className="action-text__container">
                <h1 className="action-text action-text__bold">{blockedAdsCount}</h1>
                &nbsp;
                <h6 className="action-text ">
                    {reactTranslator.getMessage('popup_trackers_and_ad_blockers')}
                </h6>
            </section>
        );
    }

    // TODO add click handler for reporting site
    return (
        <button type="button" className="action-button" onClick={onClick}>
            {reactTranslator.getMessage('popup_report_site_option')}
        </button>
    );
});
