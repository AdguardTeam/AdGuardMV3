import { PROTECTION_ENABLED_KEY } from 'Common/constants';
import { log } from 'Common/logger';
import { messaging } from './messaging';

log.debug('Background service worker has loaded via Manifest V3.');

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ [PROTECTION_ENABLED_KEY]: true });
});

messaging.init();

// TODO tasks
//  - add about page content
//  - add info about desktop version
//  - use types checker fork-ts-checker-webpack-plugin
//  - add husky to run linter before commit
//  - add husky to run tests before push
//  - get current tab info to show on popup
//  - enable disable blocking from popup
//  - add possibility do download/upload messages and validate them
//  - add possibility to block elements with assistant
//  - implement report site functionality
//  - make wizard to show just once after install
