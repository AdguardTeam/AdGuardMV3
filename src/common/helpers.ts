import { log } from './logger';

// FIXME use @adguard/translate
export const translate = (key: string) => chrome.i18n.getMessage(key);

export const sendMessage = (type: string, data?: any) => new Promise((resolve, reject) => {
    log.debug('Sending message:', type);
    const message = { type, data };
    chrome.runtime.sendMessage({ type, data }, (...args) => {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
        }
        // FIXME make possible log to receive objects
        log.info('Sent message: ', message);
        resolve(...args);
    });
});

export const applyCss = (css: string[]) => {
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
