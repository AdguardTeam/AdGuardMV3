import { MESSAGE_TYPES } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

export const sender = {
    setProtectionEnabled: (protectionEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_PROTECTION_ENABLED,
        { protectionEnabled },
    ),
    getProtectionEnabled: () => sendMessage<boolean>(MESSAGE_TYPES.GET_PROTECTION_ENABLED),
    setNoticeHidden: (noticeHidden: boolean) => sendMessage(
        MESSAGE_TYPES.SET_NOTICE_HIDDEN,
        { noticeHidden },
    ),
    getNoticeHidden: () => sendMessage<boolean>(MESSAGE_TYPES.GET_NOTICE_HIDDEN),
};
