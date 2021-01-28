import { log } from 'Common/logger';
import { messaging } from './messaging';
import { app } from './app';

log.debug('Background service worker has loaded via Manifest V3.');

/**
 * Messaging is initiated first as it is mainly used to wake up background service worker
 */
messaging.init();

(async () => {
    await app.init();
})();
