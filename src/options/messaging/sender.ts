import { MESSAGE_TYPES, OptionsData } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

export const sender = {
    setFilteringEnabled: (filteringEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_FILTERING_ENABLED,
        { filteringEnabled },
    ),
    getFilteringEnabled: () => sendMessage<boolean>(MESSAGE_TYPES.GET_FILTERING_ENABLED),
    setOptionsData: (optionsData: OptionsData) => sendMessage(
        MESSAGE_TYPES.SET_OPTIONS_DATA,
        optionsData,
    ),
    getOptionsData: () => sendMessage<OptionsData>(MESSAGE_TYPES.GET_OPTIONS_DATA),
};
