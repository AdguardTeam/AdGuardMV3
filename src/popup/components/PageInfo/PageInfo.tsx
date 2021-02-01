import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { rootStore } from '../../stores';

import './page-info.pcss';

export const PageInfo = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { filteringEnabled, currentSite } = settingsStore;

    const labelKey = filteringEnabled
        ? 'popup_protection_enabled_status'
        : 'popup_protection_disabled_status';

    return (
        <section>
            <h1 className="page-info page-info__main">{currentSite}</h1>
            <h6 className="page-info page-info__additional">{reactTranslator.getMessage(labelKey)}</h6>
        </section>
    );
});
