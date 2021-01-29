import React, { useLayoutEffect, useState } from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import cn from 'classnames';
import { sender } from '../../messaging/sender';

import styles from './Notice.module.pcss';

// TODO: change link, add to tds
const COMPARISON_LINK = 'https://adguard.com';

const Notice = () => {
    const [isHidden, setHidden] = useState(true);
    useLayoutEffect(() => {
        (async () => {
            const { noticeHidden } = await sender.getOptionsData();
            setHidden(noticeHidden);
        })();
    }, []);

    const hide = async () => {
        await sender.setOptionsData({ noticeHidden: true });
        setHidden(true);
    };

    if (isHidden) {
        return null;
    }

    return (
        <div className={styles.container}>
            <hr className={cn(theme.common.hr, styles.noticeHr)} />
            <div className={styles.notice}>{reactTranslator.getMessage('options_notice_program')}</div>
            <a
                href={COMPARISON_LINK}
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
};
export { Notice };
