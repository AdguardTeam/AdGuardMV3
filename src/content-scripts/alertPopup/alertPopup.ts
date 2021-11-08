const MAX_Z_INDEX = '2147483647';

const DISPLAY_TIMEOUT_MS = 4000;

const RETRY_TIMEOUT_MS = 500;

/**
 * Creates iframe and appends it after target open tag
 */
const appendIframe = (target: HTMLElement, html: string) => {
    const iframe = document.createElement('iframe');
    target.insertAdjacentElement('afterbegin', iframe);
    iframe.src = 'about:blank';
    if (navigator.userAgent.indexOf('Edge') > -1) {
        // Edge doesn't allow to write html in iframe srcdoc
        const iframedoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframedoc) {
            iframedoc.open();
            iframedoc.write(html);
            iframedoc.close();
        }
    } else {
        iframe.srcdoc = html;
    }
    iframe.style.zIndex = MAX_Z_INDEX;
    return iframe;
};

/**
 * Creates div and appends it to the page
 */
const appendDiv = (target: HTMLElement, html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    target.insertAdjacentElement('afterbegin', div);
    div.style.zIndex = MAX_Z_INDEX;
    return div;
};

/**
 * If isAdguardTab we append div, else we append iframe
 */
const appendAlertElement = (target: HTMLElement, html: string, isAdguardTab: boolean) => {
    if (isAdguardTab) {
        return appendDiv(target, html);
    }
    return appendIframe(target, html);
};

/**
 * Generates alert html
 */
const genAlertHtml = (title: string, text: string) => {
    let descBlock = '';
    if (text.length > 0) {
        descBlock = `<div class="adguard-popup-alert__desc">
                        ${text}
                    </div>`;
    }

    // don't show description text if it is same as title or if it is equal to undefined
    if (title === text) {
        descBlock = '';
    }

    let titleBlock = '';
    if (title.length > 0) {
        titleBlock = `<div class="adguard-popup-alert__title">
                        ${title}
                    </div>`;
    }

    return `<div class="adguard-popup">
                <div class="adguard-popup-alert">
                    <div class="adguard-popup-logo"></div>
                    <div class="adguard-popup-content">
                        ${titleBlock}
                        ${descBlock}
                    </div>
                    <button id="adguard-popup-close" class="adguard-popup__cross"></button>
                </div>
            </div>`;
};

/**
 * Shows alert popup.
 * Popup content is added right to the page content.
 */

export type AlertPopup = {
    text: string | string[],
    title: string,
    isAdguardTab: boolean,
};

const showAlertPopup = (message: AlertPopup) => {
    const { text, title, isAdguardTab } = message;

    let messages = [];
    if (Array.isArray(text)) {
        messages = text;
    } else {
        messages = [text];
    }

    let fullText = '';
    for (let i = 0; i < messages.length; i += 1) {
        if (i > 0) {
            fullText += ', ';
        }
        fullText += messages[i];
    }

    const alertDivHtml = genAlertHtml(title, fullText);

    const MAX_RETRY_COUNT = 10;

    function appendPopup(count: number) {
        if (count >= MAX_RETRY_COUNT) {
            return;
        }

        if (document.body) {
            const alertElement = appendAlertElement(document.body, alertDivHtml, isAdguardTab);
            alertElement.classList.add('adguard-alert-iframe');
            const closeButton = document.getElementById('adguard-popup-close');

            if (closeButton) {
                const onClick = () => {
                    if (alertElement && alertElement.parentNode) {
                        alertElement.parentNode.removeChild(alertElement);
                    }
                };

                closeButton.addEventListener('mouseup', onClick);
            }
            setTimeout(() => {
                if (alertElement && alertElement.parentNode) {
                    alertElement.parentNode.removeChild(alertElement);
                }
            }, DISPLAY_TIMEOUT_MS);
        } else {
            setTimeout(() => {
                appendPopup(count + 1);
            }, RETRY_TIMEOUT_MS);
        }
    }

    appendPopup(0);
};

export const alertPopup = {
    showAlertPopup,
};
