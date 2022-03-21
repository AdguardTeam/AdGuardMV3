// TODO remove ts-ignore
// @ts-ignore
import TSUrlFilter from '@adguard/tsurlfilter/dist/TSUrlFilterContentScript';

import { log } from 'Common/logger';
import { sender } from './messaging/sender';
import { subscribe } from './subscribe';

log.debug('Content script has loaded via Manifest V3.');

const applyExtendedCss = (extendedCss: string[]) => {
    if (!extendedCss || !extendedCss.length) {
        return;
    }

    const styleSheet = extendedCss.join('\n');
    if (!styleSheet) {
        return;
    }

    const extcss = new TSUrlFilter.ExtendedCss({
        styleSheet,
    });
    extcss.apply();
};

const applyCss = (css: string[]) => {
    if (!css || css.length === 0) {
        return;
    }

    css.forEach((cssContent) => {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('type', 'text/css');
        styleEl.textContent = cssContent;

        (document.head || document.documentElement).appendChild(styleEl);
    });
};

const tryLoadCssAndScripts = async () => {
    const response = await sender.getCss(document.location.href);
    applyCss(response.css);
    applyExtendedCss(response.extendedCss);
};

subscribe.init();

(async () => {
    // TODO remove
    if (!document.location.href.includes('example.org')) {
        return;
    }

    try {
        await tryLoadCssAndScripts();
    } catch (err) {
        log.error(err);
    }
})();
