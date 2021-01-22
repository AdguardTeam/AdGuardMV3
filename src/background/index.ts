import { PROTECTION_ENABLED_KEY } from '../common/constants';
import { messaging } from './messaging';
import { log } from '../common/logger';

log.debug('Background service worker has loaded via Manifest V3.');

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ [PROTECTION_ENABLED_KEY]: true });
});

messaging.init();

// FIXME Finish tasks
//  - Browser-action icons
//  - use @adguard/translate
//  - use types checker fork-ts-checker-webpack-plugin
//  - add husky to run linter before commit
//  - add husky to run tests before push
//  - get current tab info to show on popup
