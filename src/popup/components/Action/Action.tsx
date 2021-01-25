import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { rootStore } from '../../stores';

import './action.pcss';

export const Action = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled } = settingsStore;

    const blockedAdsCount = 354; // TODO replace with real number

    if (protectionEnabled) {
        return (
            <section className="action-text__container">
                <h1 className="action-text action-text__bold">{blockedAdsCount}</h1>
                &nbsp;
                <h6 className="action-text ">
                    {reactTranslator.getMessage('options_trackers_and_ad_blockers')}
                </h6>
            </section>
        );
    }

    // TODO add click handler for reporting site
    return (
        <button type="button" className="action-button">
            {reactTranslator.getMessage('options_report_site_option')}
        </button>
    );
});
