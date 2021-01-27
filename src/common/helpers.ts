import { log } from './logger';

export const sendMessage = (type: string, data?: any) => new Promise((resolve, reject) => {
    log.debug('Sending message:', type);
    const message = { type, data };
    chrome.runtime.sendMessage({ type, data }, (...args) => {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
        }
        log.info('Sent message: ', message);
        resolve(...args);
    });
});

export const getActiveTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const error = chrome.runtime.lastError;
            if (error) {
                reject(error);
            }

            const [tab] = tabs;
            resolve(tab);
        });
    });
};

interface URLInfo extends URL {
    domainName: string;
}

/**
 * Removes www from hostname if necessary
 * @param hostname
 */
const cropHostname = (hostname: string) => {
    return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
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
