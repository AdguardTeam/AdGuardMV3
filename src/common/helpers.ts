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
