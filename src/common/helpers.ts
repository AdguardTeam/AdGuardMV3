import { Message, MessageType } from 'Common/constants';
import { log } from './logger';

export const sendMessage = <T>(type: MessageType, data?: any): Promise<T> => new Promise(
    (resolve, reject) => {
        const message: Message = { type };
        if (data) {
            message.data = data;
        }
        log.debug('Sent message:', message);
        chrome.runtime.sendMessage(message, (...args) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            log.info('Received response on message:', message.type, 'response: ', ...args);
            resolve(...args);
        });
    },
);

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
