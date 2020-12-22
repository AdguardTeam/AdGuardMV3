/* global chrome */
export const translate = (key) => chrome.i18n.getMessage(key);

/* TODO promisify */
export const sendMessage = (type, data, callback) => chrome.runtime.sendMessage({
    type,
    data,
}, callback);

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
