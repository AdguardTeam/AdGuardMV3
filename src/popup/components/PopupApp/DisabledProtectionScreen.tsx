import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { Icon, ICON_ID } from 'Common/components/ui';
import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { rootStore } from '../../stores';
import { sender } from '../../messaging/sender';

import styles from './DisabledProtectionScreen.module.pcss';

export const DisabledProtectionScreen = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const {
        protectionPaused,
        protectionPausedTimer,
        resetProtectionPausedTimeout,
    } = settingsStore;

    const onEnableProtectionClick = async () => {
        await resetProtectionPausedTimeout();
        await sender.removeProtectionPauseTimer();
        await settingsStore.setSetting(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES, 0);
        await sender.reloadActiveTab();
    };

    return (
        <>
            <div>
                <Icon id={ICON_ID.DISABLED_LOGO} />
            </div>
            <div className={styles.sectionContainer}>
                <section>
                    <h1 className={theme.common.pageInfoMain}>{reactTranslator.getMessage('popup_protection_is_paused')}</h1>
                    {protectionPaused && (
                        <h6 className={cn(theme.common.pageInfoAdditional,
                            styles.pageInfoAdditional)}
                        >
                            {reactTranslator.getMessage('popup_protection_will_be_resumed_after', { count: protectionPausedTimer })}
                        </h6>
                    )}
                </section>
                <button
                    type="button"
                    className={cn(theme.common.actionButton, styles.buttonGreen)}
                    onClick={onEnableProtectionClick}
                >
                    {reactTranslator.getMessage('popup_protection_resume_now')}
                </button>
            </div>
        </>
    );
});
