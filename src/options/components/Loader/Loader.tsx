import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from 'Options/stores';
import { Icon, IconId } from 'Common/components/ui';
import style from './loader.module.pcss';

export const Loader = observer(() => {
    const { uiStore } = useContext(rootStore);

    if (uiStore.loader) {
        return (
            <div className={style.loader}>
                <Icon id={IconId.LOADER} className={style.wheel} />
            </div>
        );
    }

    return null;
});
