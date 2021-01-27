import { log } from 'Common/logger';
import { messaging } from './messaging';
import { app } from './app';

log.debug('Background service worker has loaded via Manifest V3.');

messaging.init();

(async () => {
    await app.init();
})();
