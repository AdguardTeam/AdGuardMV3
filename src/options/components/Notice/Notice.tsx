import React, { useContext } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { SETTINGS_NAMES } from 'Common/constants/settings-constants';
import { LEARN_MORE } from 'Common/constants/urls';

import { rootStore } from '../../stores';

import styles from './Notice.module.pcss';

const Notice = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore } = store;
    const { noticeHidden } = settingsStore;

    const hide = async () => {
        await settingsStore.setSetting(SETTINGS_NAMES.NOTICE_HIDDEN, true);
    };

    if (noticeHidden) {
        return null;
    }

    return (
        <div className={styles.container}>
            <hr className={cn(theme.common.hr, styles.noticeHr)} />
            <div className={styles.notice}>{reactTranslator.getMessage('options_notice_program')}</div>
            <a
                href={LEARN_MORE}
                className={cn(theme.common.link, styles.compareLink)}
                rel="noopener noreferrer"
                target="_blank"
            >
                {reactTranslator.getMessage('options_notice_compare_link')}
            </a>
            <button
                type="button"
                className={styles.button}
                onClick={hide}
            >
                {reactTranslator.getMessage('options_notice_hide')}
            </button>
        </div>
    );
});

export { Notice };
