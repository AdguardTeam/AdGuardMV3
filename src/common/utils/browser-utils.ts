/* eslint-disable class-methods-use-this */
import { prefs } from 'Common/prefs';

class BrowserUtils {
    isYaBrowser(): boolean {
        return prefs.browser === 'YaBrowser';
    }

    isOperaBrowser(): boolean {
        return prefs.browser === 'Opera';
    }

    isEdgeBrowser(): boolean {
        return prefs.browser === 'EdgeChromium';
    }

    isFirefoxBrowser(): boolean {
        return prefs.browser === 'Firefox';
    }

    isChromeBrowser(): boolean {
        return prefs.browser === 'Chrome';
    }

    isChromium(): boolean {
        return prefs.platform === 'chromium';
    }
}

export const browserUtils = new BrowserUtils();
