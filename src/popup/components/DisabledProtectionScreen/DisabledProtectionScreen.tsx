import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';

import { rootStore } from '../../stores';
import { Switcher } from '../Switcher';

import styles from './DisabledProtectionScreen.module.pcss';

export const DisabledProtectionScreen = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        resumeProtection,
        protectionPauseExpiresSec,
    } = settingsStore;

    const title = protectionPauseExpiresSec > 0
        ? reactTranslator.getMessage(
            'popup_protection_will_be_resumed_after',
            { count: protectionPauseExpiresSec },
        )
        : reactTranslator.getMessage('popup_protection_paused_for_all');

    return (
        <>
            <div className={styles.sectionContainer}>
                <section className={styles.section}>
                    <h1 className={styles.pageInfoMain}>
                        {reactTranslator.getMessage('popup_protection_is_paused')}
                    </h1>
                    <h6 className={cn(theme.common.pageInfoAdditional, styles.pageInfoAdditional)}>
                        {title}
                    </h6>
                </section>
                <Switcher disabled />
                <button
                    type="button"
                    className={cn(theme.common.actionButton, styles.buttonGreen)}
                    onClick={resumeProtection}
                >
                    {reactTranslator.getMessage('popup_protection_resume_now')}
                </button>
            </div>
        </>
    );
});
