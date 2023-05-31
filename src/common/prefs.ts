import { lazyGet } from 'Common/utils/lazy';

/**
 * Extension global preferences.
 */
export const prefs = (() => {
    const Prefs = {
        get ICONS() {
            return lazyGet(Prefs, 'ICONS', () => ({
                ENABLED: {
                    19: chrome.runtime.getURL('assets/icons/enabled-19.png'),
                    38: chrome.runtime.getURL('assets/icons/enabled-38.png'),
                },
                DISABLED: {
                    19: chrome.runtime.getURL('assets/icons/disabled-19.png'),
                    38: chrome.runtime.getURL('assets/icons/disabled-38.png'),
                },
                BROKEN: {
                    19: chrome.runtime.getURL('assets/icons/broken-19.png'),
                    38: chrome.runtime.getURL('assets/icons/broken-38.png'),
                },
            }));
        },

        get browser() {
            return lazyGet(Prefs, 'browser', () => {
                let browser;
                let { userAgent } = navigator;
                userAgent = userAgent.toLowerCase();
                if (userAgent.indexOf('yabrowser') >= 0) {
                    browser = 'YaBrowser';
                } else if (userAgent.indexOf('edge') >= 0) {
                    browser = 'Edge';
                } else if (userAgent.indexOf('edg') >= 0) {
                    browser = 'EdgeChromium';
                } else if (userAgent.indexOf('opera') >= 0
                    || userAgent.indexOf('opr') >= 0) {
                    browser = 'Opera';
                } else if (userAgent.indexOf('firefox') >= 0) {
                    browser = 'Firefox';
                } else {
                    browser = 'Chrome';
                }
                return browser;
            });
        },

        get platform() {
            // @ts-ignore
            return lazyGet(Prefs, 'platform', () => (global.browser ? 'firefox' : 'chromium'));
        },
    };

    return Prefs;
})();
