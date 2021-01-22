import { log } from '../common/logger';
import { sender } from './messaging/sender';
import { applyCss } from '../common/helpers';

log.debug('Content script has loaded via Manifest V3.');

const tryLoadCssAndScripts = async () => {
    const response = await sender.getCss() as string[];
    applyCss(response);
};

(async () => {
    try {
        await tryLoadCssAndScripts();
    } catch (err) {
        log.error(err);
    }
})();
