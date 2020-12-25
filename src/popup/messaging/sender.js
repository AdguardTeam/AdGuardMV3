import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export default {
    setProtectionEnabled: (protectionEnabled) => sendMessage(
        MESSAGES.setProtectionEnabled, {
            [PROTECTION_ENABLED_KEY]: protectionEnabled,
        },
    ),
    getProtectionEnabled: () => sendMessage(MESSAGES.getProtectionEnabled),
};
