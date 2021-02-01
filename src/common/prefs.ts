/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Adguard Browser Extension.  If not, see <http://www.gnu.org/licenses/>.
 */

import { lazyGet } from 'Common/utils/lazy';

/**
 * Extension global preferences.
 */
export const prefs = (() => {
    const Prefs = {

        get mobile() {
            return lazyGet(Prefs, 'mobile', () => navigator.userAgent.indexOf('Android') >= 0);
        },

        get platform() {
            return lazyGet(Prefs, 'platform', () => (window.chrome ? 'chromium' : 'firefox'));
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

        get chromeVersion() {
            return lazyGet(Prefs, 'chromeVersion', () => {
                const match = /\sChrome\/(\d+)\./.exec(navigator.userAgent);
                return match === null ? null : Number.parseInt(match[1], 10);
            });
        },

        get firefoxVersion() {
            return lazyGet(Prefs, 'firefoxVersion', () => {
                const match = /\sFirefox\/(\d+)\./.exec(navigator.userAgent);
                return match === null ? null : Number.parseInt(match[1], 10);
            });
        },

        /**
         * https://msdn.microsoft.com/ru-ru/library/hh869301(v=vs.85).aspx
         * @returns {*}
         */
        get edgeVersion() {
            // eslint-disable-next-line consistent-return
            return lazyGet(Prefs, 'edgeVersion', () => {
                // @ts-ignore
                if (this.browser === 'Edge') {
                    const { userAgent } = navigator;
                    const i = userAgent.indexOf('Edge/');
                    if (i < 0) {
                        return {
                            rev: 0,
                            build: 0,
                        };
                    }
                    const version = userAgent.substring(i + 'Edge/'.length);
                    const parts = version.split('.');
                    return {
                        rev: Number.parseInt(parts[0], 10),
                        build: Number.parseInt(parts[1], 10),
                    };
                }
            });
        },

        /**
         * Makes sense in case of FF add-on only
         */
        speedupStartup() {
            return false;
        },

        get ICONS() {
            return lazyGet(Prefs, 'ICONS', () => ({
                ICON_GREEN: {
                    16: chrome.runtime.getURL('assets/green-16.png'),
                    19: chrome.runtime.getURL('assets/green-19.png'),
                    38: chrome.runtime.getURL('assets/green-38.png'),
                    128: chrome.runtime.getURL('assets/green-128.png'),
                },
            }));
        },

        // interval 60 seconds in Firefox is set so big
        // due to excessive IO operations on every storage save
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1006
        get statsSaveInterval() {
            return this.browser === 'Firefox' ? 1000 * 60 : 1000;
        },
    };

    return Prefs;
})();
