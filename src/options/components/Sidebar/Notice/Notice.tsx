import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { theme } from 'Common/styles';
import { IconId } from 'Common/constants/icons';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { LEARN_MORE } from 'Common/constants/urls';
import { rootStore } from 'Options/stores';
import { Icon } from 'Common/components/ui';

import style from './notice.module.pcss';

export const Notice = observer(() => {
    const store = useContext(rootStore);
    const { settingsStore } = store;
    const { noticeHidden } = settingsStore;

    const hide = async () => {
        await settingsStore.setNoticeHidden(true);
    };

    if (noticeHidden) {
        return null;
    }

    return (
        <div className={style.block}>
            <div className={style.message}>
                {reactTranslator.getMessage('options_notice_program')}
            </div>
            <a
                href={LEARN_MORE}
                target="_blank"
                className={cn(
                    theme.button.middle,
                    theme.button.green,
                    theme.button.stretch,
                )}
                rel="noreferrer"
            >
                {reactTranslator.getMessage('options_notice_compare_link')}
            </a>
            <button
                type="button"
                className={style.close}
                onClick={hide}
            >
                <Icon id={IconId.CROSS} />
            </button>
        </div>
    );
});
