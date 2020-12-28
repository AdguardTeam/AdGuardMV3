import { log } from './logger';

export const promisify = (f) => (...args) => new Promise((resolve, reject) => {
    const callback = (...args) => {
        const { lastError } = chrome.runtime;
        if (lastError) {
            reject(lastError);
            return;
        }

        if (args.length === 1) {
            resolve(...args);
        }

        resolve(args);
    };

    f(...args, callback);
});

export const translate = (key) => chrome.i18n.getMessage(key);

export const sendMessage = (type, data) => {
    if (!chrome.runtime.sendMessagePromisified) {
        chrome.runtime.sendMessagePromisified = promisify(chrome.runtime.sendMessage);
    }

    const message = { type, ...data !== undefined && { data } };

    log.info('Sent message: ', message);
    return chrome.runtime.sendMessagePromisified(message);
};

export const applyCss = (css) => {
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
