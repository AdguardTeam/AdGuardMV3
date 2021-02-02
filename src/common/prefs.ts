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
    };

    return Prefs;
})();
