import { MESSAGE_TYPES } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export const sender = {
    setProtectionEnabled: (protectionEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_PROTECTION_ENABLED,
        { protectionEnabled },
    ),
    getProtectionEnabled: () => sendMessage(MESSAGE_TYPES.GET_PROTECTION_ENABLED),
};
