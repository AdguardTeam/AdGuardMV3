import { Message, MessageType } from 'Common/constants';

export const sendMessage = <T = void>(type: MessageType, data?: any): Promise<T> => new Promise(
    (resolve, reject) => {
        const message: Message = { type };
        if (data) {
            message.data = data;
        }
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
                return;
            }
            resolve(response);
        });
    },
);

// Keep in sync with the same function in tasks helpers
export const getUrlWithQueryString = (url: string, params: { [key: string]: string }) => {
    const searchParams = new URLSearchParams(params);

    return `${url}?${searchParams.toString()}`;
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

type Obj = Record<string, any>;

const validateKeyInObject = (obj: Obj, key: keyof Obj): undefined | never => {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
        throw new Error(`The key "${key}" to group by is not in the object ${JSON.stringify(obj, null, 4)}`);
    }
    return undefined;
};

/**
 * Groups array by key
 * @param arr
 * @param key
 */
export const groupByKeyValue = (arr: Obj[], key: keyof Obj): Obj => {
    return arr.reduce(
        (acc: { [key: string]: Obj[] }, cur: Obj) => {
            validateKeyInObject(cur, key);

            const groupValue = cur[key];
            acc[groupValue] = (acc[groupValue] || []).concat(cur);
            return acc;
        }, {},
    );
};

export const isHttpRequest = (url: string) => {
    return url && url.indexOf('http') === 0;
};
