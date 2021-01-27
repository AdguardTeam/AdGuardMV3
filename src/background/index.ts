import { STORAGE_KEYS } from 'Common/constants';
import { log } from 'Common/logger';
import { messaging } from './messaging';

log.debug('Background service worker has loaded via Manifest V3.');

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ [STORAGE_KEYS.PROTECTION_ENABLED]: true });
});

messaging.init();
