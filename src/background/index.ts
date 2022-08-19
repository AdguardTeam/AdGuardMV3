import { log } from 'Common/logger';

import { messaging, initExtension } from './messaging';
import { contextMenu } from './context-menu';
import { browserActions } from './browser-actions';
import { tsWebExtensionWrapper } from './tswebextension';

log.debug('Background service worker has loaded via Manifest V3.');

// Messaging is initiated first as it is used to wake up background service worker
messaging.init();
contextMenu.init();
browserActions.init();

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    // Start the service worker immediately after installing the extension
    // to reduce the waiting time for the service worker to wake up
    // on the message handler
    await initExtension();

    // Enable language filter only on first install
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        await tsWebExtensionWrapper.enableCurrentLanguagesFilters();
    }
});

// TODO: do not use same selector twice
// https://uploads.adguard.com/Image_2022-06-01_17-22-29.png
// TODO: fix copying of manifest file during watch
