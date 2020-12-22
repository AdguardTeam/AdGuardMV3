import log from '../common/logger';
import sender from './messaging/sender';
import { applyCss } from '../common/helpers';

log.debug('Content script has loaded via Manifest V3.');

const tryLoadCssAndScripts = () => {
    sender.getCss(applyCss);
};

tryLoadCssAndScripts();
