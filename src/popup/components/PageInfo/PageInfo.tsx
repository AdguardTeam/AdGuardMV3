import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import cn from 'classnames';
import { rootStore } from '../../stores';
import styles from './PageInfo.module.pcss';

export const PageInfo = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { filteringEnabled, currentSite } = settingsStore;

    const labelKey = filteringEnabled
        ? 'popup_protection_enabled_status'
        : 'popup_protection_disabled_status';

    const className = cn({
        [styles.sectionDisabled]: !filteringEnabled,
    });

    return (
        <section className={className}>
            <h1 className={theme.common.pageInfoMain}>{currentSite}</h1>
            <h6 className={theme.common.pageInfoAdditional}>
                {reactTranslator.getMessage(labelKey)}
            </h6>
        </section>
    );
});
