import { MESSAGE_TYPES } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

export const sender = {
    setFilteringEnabled: (filteringEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_FILTERING_ENABLED,
        { filteringEnabled },
    ),
    getFilteringEnabled: () => sendMessage(MESSAGE_TYPES.GET_FILTERING_ENABLED),
};
