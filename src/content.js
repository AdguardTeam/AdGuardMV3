console.log("Content script has loaded via Manifest V3.");

const setStyleContent = (styleEl, cssContent) => {
    styleEl.textContent = cssContent;
};

const applyCss = (css) => {
    if (!css || css.length === 0) {
        return;
    }

    css.forEach((cssContent) => {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('type', 'text/css');
        setStyleContent(styleEl, cssContent);

        (document.head || document.documentElement).appendChild(styleEl);
    })
};

const tryLoadCssAndScripts = async () => {
    chrome.runtime.sendMessage({type: 'getCss'}, (response) => {
        applyCss(response);
    });
};

tryLoadCssAndScripts();
