import React, { useLayoutEffect, useState } from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { storage } from '../../../background/storage';

import styles from './Notice.module.pcss';

// TODO: change link, add to tds
const COMPARISON_LINK = 'https://adguard.com';
const STORAGE_KEY_HIDDEN = 'NOTICE_HIDDEN';

const Notice = () => {
    const [isHidden, setHidden] = useState(true);

    useLayoutEffect(() => {
        (async () => {
            setHidden(await storage.get(STORAGE_KEY_HIDDEN));
        })();
    }, []);

    const hide = async () => {
        await storage.set(STORAGE_KEY_HIDDEN, true);
        setHidden(true);
    };

    if (isHidden) {
        return null;
    }

    return (
        <div className={styles.container}>
            <hr className={styles.noticeHr} />
            <div className={styles.notice}>{reactTranslator.getMessage('options_notice_program')}</div>
            <a
                href={COMPARISON_LINK}
                className={styles.compareLink}
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
