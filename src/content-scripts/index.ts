import '@adguard/tswebextension/mv3/content-script';
import { MESSAGE_TYPES } from 'Common/constants/common';

import { subscribe } from './subscribe';

// TODO: Temporary construction for keeping alive service worker
// via constantly standing message exchange
if (window.top === window && (document.documentElement instanceof HTMLElement)) {
    setInterval(() => {
        try {
            chrome.runtime.sendMessage({ type: MESSAGE_TYPES.PING });
        // eslint-disable-next-line no-empty
        } catch (e) { }
    }, 10000);
}

subscribe.init();
