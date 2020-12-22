import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export default {
    setProtectionEnabled: (protectionEnabled, callback) => sendMessage(
        MESSAGES.setProtectionEnabled, {
            [PROTECTION_ENABLED_KEY]: protectionEnabled,
        },
        callback
    ),
    getProtectionEnabled: (callback) => sendMessage(
        MESSAGES.getProtectionEnabled, undefined, callback
    ),
};
