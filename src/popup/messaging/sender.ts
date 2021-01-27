import { sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES } from 'Common/constants';

export const sender = {
    setProtectionEnabled: (protectionEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_PROTECTION_ENABLED,
        { protectionEnabled },
    ),
    getProtectionEnabled: () => sendMessage<boolean>(MESSAGE_TYPES.GET_PROTECTION_ENABLED),
};
