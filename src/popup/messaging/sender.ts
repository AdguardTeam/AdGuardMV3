import { sendMessage } from '../../common/helpers';
import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';

export const sender = {
    setProtectionEnabled: (protectionEnabled: boolean) => sendMessage(
        MESSAGES.SET_PROTECTION_ENABLED, {
            [PROTECTION_ENABLED_KEY]: protectionEnabled,
        },
    ),
    getProtectionEnabled: () => sendMessage(MESSAGES.GET_PROTECTION_ENABLED),
};
