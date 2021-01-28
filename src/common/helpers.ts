import { Message, MessageType } from 'Common/constants';
import { log } from './logger';

export const sendMessage = (type: MessageType, data?: any) => new Promise((resolve, reject) => {
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
});

interface WaitPredicate {
    (): boolean;
}

/**
 * Function waits until timeout or predicate returns true
 * @param predicate
 * @param maxToWaitMs
 */
export const waitFor = (predicate: WaitPredicate, maxToWaitMs: number = 1000) => {
    let intervalId: number;
    const startTime = Date.now();
    const POLL_INTERVAL_MS = 50;

    return new Promise((resolve, reject) => {
        intervalId = window.setInterval(() => {
            if ((startTime + maxToWaitMs) < Date.now()) {
                clearInterval(intervalId);
                reject(new Error(`Waiting for ${predicate} stopped by timeout`));
            }
            if (predicate()) {
                clearInterval(intervalId);
                resolve(true);
            }
        }, POLL_INTERVAL_MS);
    });
};

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
