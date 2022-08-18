import { Message, MessageType } from 'Common/constants/common';

export const sendMessage = <T = void>(type: MessageType, data?: any): Promise<T> => new Promise(
    (resolve, reject) => {
        const message: Message = { type };
        if (data) {
            message.data = data;
        }
        // TODO: Remove callback and return promise as result of call sendMessage
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            if (response?.error) {
                reject(new Error(response.error.message));
                return;
            }

            resolve(response);
        });
    },
);

// Check if there are query parameters in the url
const hasQueryParameters = (url: string) => {
    const urlParts = url.split('?');
    return urlParts.length > 1;
};

// Keep in sync with the same function in tasks helpers
export const getUrlWithQueryString = (url: string, params: { [key: string]: string }) => {
    const searchParams = new URLSearchParams(params);
    const separator = hasQueryParameters(url) ? '&' : '?';
    return `${url}${separator}${searchParams.toString()}`;
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

export const isHttpRequest = (url: string): boolean => {
    return url.indexOf('http') === 0;
};

/**
 * Returns the index of the first character inside the search
 * @param str
 * @param searchString
 */
export const indexOfIgnoreCase = (str: string, searchString: string) => {
    return str.toLowerCase().indexOf(searchString.toLowerCase());
};

/**
 * Returns true if the str is inside the search
 * @param str
 * @param searchString
 */
export const containsIgnoreCase = (str: string, searchString: string) => {
    return !!(str && searchString && indexOfIgnoreCase(str, searchString) >= 0);
};

/**
 * Returns an array with the search match and the rest of the string in its original order
 * @param str
 * @param searchString
 * @param chunks
 */
export const findChunks = (str: string, searchString: string, chunks: string[] = []) => {
    const ind = indexOfIgnoreCase(str, searchString);
    if (ind > -1) {
        chunks.push(str.slice(0, ind));
        chunks.push(str.slice(ind, ind + searchString.length));
        const restStr = str.slice(ind + searchString.length);
        if (containsIgnoreCase(restStr, searchString)) {
            findChunks(restStr, searchString, chunks);
        } else {
            chunks.push(restStr);
        }
    }
    return chunks.filter((i) => !!i);
};
