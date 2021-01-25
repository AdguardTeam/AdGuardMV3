import { PROTECTION_ENABLED_KEY } from 'Common/constants';
import { log } from 'Common/logger';
import { messaging } from './messaging';

log.debug('Background service worker has loaded via Manifest V3.');

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ [PROTECTION_ENABLED_KEY]: true });
});

messaging.init();
