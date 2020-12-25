export const promisify = (f) => (...args) => new Promise((resolve, reject) => {
    const callback = (response) => {
        const { lastError } = chrome.runtime;
        if (lastError) {
            reject(lastError);
            return;
        }
        resolve(response);
    };

    f(...args, callback);
});

export const translate = (key) => chrome.i18n.getMessage(key);

export const sendMessage = (type, data) => promisify(chrome.runtime.sendMessage)({
    type,
    data,
});

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
