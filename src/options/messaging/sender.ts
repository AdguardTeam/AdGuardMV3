import { MESSAGE_TYPES } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

export const sender = {
    setFilteringEnabled: (filteringEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_FILTERING_ENABLED,
        { filteringEnabled },
    ),
    getFilteringEnabled: () => sendMessage<boolean>(MESSAGE_TYPES.GET_FILTERING_ENABLED),
    setNoticeHidden: (noticeHidden: boolean) => sendMessage(
        MESSAGE_TYPES.SET_NOTICE_HIDDEN,
        { noticeHidden },
    ),
    getNoticeHidden: () => sendMessage<boolean>(MESSAGE_TYPES.GET_NOTICE_HIDDEN),
};
