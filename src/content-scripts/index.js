import log from '../common/logger';
import sender from './messaging/sender';
import { applyCss } from '../common/helpers';

log.debug('Content script has loaded via Manifest V3.');

const tryLoadCssAndScripts = async () => {
    try {
        const response = await sender.getCss();
        applyCss(response);
    } catch (err) {
        log.error(err);
    }
};

(async () => {
    await tryLoadCssAndScripts();
})();
