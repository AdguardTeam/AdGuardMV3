import { log } from 'Common/logger';
import { messaging } from './messaging';
import { app } from './app';
import { contextMenu } from './context-menu';
import { browserActions } from './browser-actions';
import { userRules } from './userRules';
import { filters } from './filters';

log.debug('Background service worker has loaded via Manifest V3.');

/**
 * Messaging is initiated first as it is used to wake up background service worker
 */
messaging.init();
contextMenu.init();
browserActions.init();

(async () => {
    await app.init();
    await filters.init();
    await userRules.init();
})();
