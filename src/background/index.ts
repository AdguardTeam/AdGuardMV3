import { log } from 'Common/logger';
import { messaging } from './messaging';
import { settings } from './settings';

log.debug('Background service worker has loaded via Manifest V3.');

// TODO service worker can get off,
//  when browser action is starting open we should wait for background page
//  to finish initialization before asking for popup data
(async () => {
    messaging.init();
    await settings.init();
})();
