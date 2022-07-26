import React from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { sender } from 'Popup/messaging/sender';

import styles from './LimitsExceed.module.pcss';

export const LimitsExceed = () => {
    const handleLimitsDetailsClick = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        // TODO: Move to enum
        await sender.openOptions('options.html#limits');
        window.close();
    };

    return (
        <section className={styles.limitsExceed}>
            <p>{reactTranslator.getMessage('popup_limits_warning')}</p>
            <button
                type="button"
                onClick={handleLimitsDetailsClick}
                className={styles.link}
            >
                {reactTranslator.getMessage('popup_limits_warning_link')}
            </button>
        </section>
    );
};
