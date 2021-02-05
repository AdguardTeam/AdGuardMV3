import { Message, MessageType, REPORT_SITE_BASE_URL } from 'Common/constants';
import { prefs } from 'Common/prefs';
import { log } from './logger';

export const sendMessage = <T = void>(type: MessageType, data?: any): Promise<T> => new Promise(
    (resolve, reject) => {
        const message: Message = { type };
        if (data) {
            message.data = data;
        }
        log.debug('Sent message:', message);
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
                return;
            }
            log.info('Received response on message:', message.type, 'response: ', response);
            resolve(response);
        });
    },
);

export const openPage = async (url: string): Promise<void> => {
    if (!url) {
        throw new Error(`Open page requires url, received, ${url}`);
    }
    await chrome.tabs.create({ url });
};

// Keep in sync with the same function in tasks helpers
export const getUrlWithQueryString = (url: string, params: { [key: string]: string }) => {
    const searchParams = new URLSearchParams(params);

    return `${url}?${searchParams.toString()}`;
};

export const openAbusePage = (url: string, filterIds: string[], productVersion: string) => {
    const supportedBrowsers = ['Chrome', 'Firefox', 'Opera', 'Safari', 'IE', 'Edge', 'Yandex'];

    const browserUrlParams = (
        supportedBrowsers.includes(prefs.browser)
            ? { browser: prefs.browser }
            : { browser: 'Other', browserDetails: prefs.browser }
    ) as { browser: string } | { browser: string, browserDetails: string };

    const urlParams = {
        product_type: 'Ext',
        product_version: productVersion,
        ...browserUrlParams,
        url,
        filters: filterIds.join('.'),
    };

    const abuseUrl = getUrlWithQueryString(REPORT_SITE_BASE_URL, urlParams);

    return openPage(abuseUrl);
};

interface URLInfo extends URL {
    domainName: string;
}

/**
 * Removes www from hostname if necessary
 * @param hostname
 */
const cropHostname = (hostname: string) => {
    return hostname.replace(/^www\./, '');
};

/**
 * Adds additional info to url info
 * @param urlInfo
 */
const extendUrlInfo = (urlInfo: URL): URLInfo => {
    const domainName = cropHostname(urlInfo.hostname);
    return {
        ...urlInfo,
        domainName,
    };
};

/**
 * Returns urls details
 * @param urlString
 */
export const getUrlDetails = (urlString: string): URLInfo | null => {
    try {
        return extendUrlInfo(new URL(urlString));
    } catch (e) {
        return null;
    }
};
