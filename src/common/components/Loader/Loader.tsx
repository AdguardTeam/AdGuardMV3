import React from 'react';

import { Icon, IconId } from 'Common/components/ui';

import style from './loader.module.pcss';

export const Loader = () => {
    return (
        <div className={style.loader}>
            <Icon id={IconId.LOADER} className={style.wheel} />
        </div>
    );
};
