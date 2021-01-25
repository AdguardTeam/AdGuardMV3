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
