import React from 'react';

import style from './loader.module.pcss';

export const Loader = () => {
    return (
        <img className={style.loader} src={chrome.runtime.getURL('assets/gifs/loading.gif')} alt="Loading" />
    );
};
