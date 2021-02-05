import { Message, MessageType } from 'Common/constants';
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

export const getPathWithQueryString = (path: string, params: { [key: string]: string }) => {
    const searchParams = new URLSearchParams(params);

    return `${path}?${searchParams.toString()}`;
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
