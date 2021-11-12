import { log } from 'Common/logger';
import { sender } from './messaging/sender';
import { subscribe } from './subscribe';

log.debug('Content script has loaded via Manifest V3.');

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
    const response = await sender.getCss();
    applyCss(response);
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
