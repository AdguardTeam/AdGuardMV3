import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translate } from '../../../common/helpers';
import { rootStore } from '../../stores';

import './action.pcss';

export const Action = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled } = settingsStore;

    return protectionEnabled
        ? (
            <section className="action-text__container">
                <h1 className="action-text action-text__bold">354</h1>
                &nbsp;
                <h6 className="action-text ">{translate('trackers_and_ad_blockers')}</h6>
            </section>
        )
        : <button type="button" className="action-button">{translate('report_site')}</button>;
});
