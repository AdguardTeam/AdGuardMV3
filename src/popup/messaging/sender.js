import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export default {
    setProtectionEnabled: (protectionEnabled) => sendMessage(
        MESSAGES.SET_PROTECTION_ENABLED, {
            [PROTECTION_ENABLED_KEY]: protectionEnabled,
        },
    ),
    getProtectionEnabled: () => sendMessage(MESSAGES.GET_PROTECTION_ENABLED),
};
