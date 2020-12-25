import { PROTECTION_ENABLED_KEY } from '../common/constants';
import { messageHandler } from './messageHandler';
import { log } from '../common/logger';

log.debug('Background service worker has loaded via Manifest V3.');

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ [PROTECTION_ENABLED_KEY]: true });
});

chrome.runtime.onMessage.addListener(messageHandler);
