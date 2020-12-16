console.log("Content script has loaded via Manifest V3.");

const protectStyleElementContent =  (protectStyleEl) => {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (!MutationObserver) {
        return;
    }
    /* observer, which observe protectStyleEl inner changes, without deleting styleEl */
    const innerObserver = new MutationObserver(((mutations) => {
        for (let i = 0; i < mutations.length; i += 1) {
            const m = mutations[i];
            if (protectStyleEl.hasAttribute('mod') && protectStyleEl.getAttribute('mod') === 'inner') {
                protectStyleEl.removeAttribute('mod');
                break;
            }

            protectStyleEl.setAttribute('mod', 'inner');
            let isProtectStyleElModified = false;

            /**
             * further, there are two mutually exclusive situations: either there were changes
             * the text of protectStyleEl, either there was removes a whole child "text"
             * element of protectStyleEl we'll process both of them
             */
            if (m.removedNodes.length > 0) {
                for (let j = 0; j < m.removedNodes.length; j += 1) {
                    isProtectStyleElModified = true;
                    protectStyleEl.appendChild(m.removedNodes[j]);
                }
            } else if (m.oldValue) {
                isProtectStyleElModified = true;
                protectStyleEl.textContent = m.oldValue;
            }

            if (!isProtectStyleElModified) {
                protectStyleEl.removeAttribute('mod');
            }
        }
    }));

    innerObserver.observe(protectStyleEl, {
        'childList': true,
        'characterData': true,
        'subtree': true,
        'characterDataOldValue': true,
    });
};

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

        protectStyleElementContent(styleEl);
    })
};

const exampleRule = ['* { background-color: pink }'];

applyCss(exampleRule);
