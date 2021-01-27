import { Message, MessageType } from 'Common/types';
import { log } from './logger';

export const sendMessage = <T>(type: MessageType, data?: any): Promise<T> => new Promise(
    (resolve, reject) => {
        const message: Message = { type, data };
        log.debug('Sending message:', message);
        chrome.runtime.sendMessage({ type, data }, (...args) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
                return;
            }
            resolve(...args);
        });
    },
);
