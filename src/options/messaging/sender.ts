import { MESSAGE_TYPES, OptionsData } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

export const sender = {
    setFilteringEnabled: (filteringEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_FILTERING_ENABLED,
        { filteringEnabled },
    ),
    setNoticeHidden: (noticeHidden: boolean) => sendMessage(
        MESSAGE_TYPES.SET_NOTICE_HIDDEN,
        { noticeHidden },
    ),
    getOptionsData: () => sendMessage<OptionsData>(MESSAGE_TYPES.GET_OPTIONS_DATA),
};
