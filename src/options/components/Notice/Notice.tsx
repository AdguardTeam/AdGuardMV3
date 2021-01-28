import React, { useLayoutEffect, useState } from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import classNames from 'classnames';
import { sender } from '../../messaging/sender';

import styles from './Notice.module.pcss';

// TODO: change link, add to tds
const COMPARISON_LINK = 'https://adguard.com';

const Notice = () => {
    const [isHidden, setHidden] = useState<boolean>(true);

    useLayoutEffect(() => {
        (async () => {
            setHidden(await sender.getNoticeHidden());
        })();
    }, []);

    const hide = async () => {
        await sender.setNoticeHidden(true);
        setHidden(true);
    };

    if (isHidden) {
        return null;
    }

    return (
        <div className={styles.container}>
            <hr className={classNames(theme.common.hr, styles.noticeHr)} />
            <div className={styles.notice}>{reactTranslator.getMessage('options_notice_program')}</div>
            <a
                href={COMPARISON_LINK}
                className={classNames(theme.common.link, styles.compareLink)}
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
};
export { Notice };
