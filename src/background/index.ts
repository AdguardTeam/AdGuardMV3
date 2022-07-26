import { log } from 'Common/logger';

import { messaging, initExtension } from './messaging';
import { contextMenu } from './context-menu';
import { browserActions } from './browser-actions';
import { filters } from './filters';

log.debug('Background service worker has loaded via Manifest V3.');

// Messaging is initiated first as it is used to wake up background service worker
messaging.init();
contextMenu.init();
browserActions.init();

// To start the extension immediately after installing it,
// to avoid waiting for the service worker to wake up
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    await initExtension();

    // Enable language filter only on first install
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        await filters.enableCurrentLanguageFilter();
    }
});

// TODO: do not use same selector twice
// https://uploads.adguard.com/Image_2022-06-01_17-22-29.png
// TODO: fix copying of manifest file during watch
