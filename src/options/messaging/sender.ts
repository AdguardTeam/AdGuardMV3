import { MESSAGE_TYPES, OptionsData } from 'Common/constants';
import { sendMessage } from 'Common/helpers';
import { SETTINGS_NAMES } from 'Common/settings-constants';

/**
 * Module with methods used to communicate with background service worker
 */
class Sender {
    /**
     * Sets settings value on background service worker by key
     * @param key
     * @param value
     */
    setSetting = (key: SETTINGS_NAMES, value: boolean) => sendMessage(
        MESSAGE_TYPES.SET_SETTING, { key, value },
    );

    /**
     * Retrieves options data from background service worker
     */
    getOptionsData = () => sendMessage<OptionsData>(MESSAGE_TYPES.GET_OPTIONS_DATA);

    enableFilter = (filterId: number): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.ENABLE_FILTER, { filterId });
    };

    disableFilter = (filterId: number): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.DISABLE_FILTER, { filterId });
    };

    getFilterInfo = (filterContent: string): Promise<FilterInfo> => {
        return sendMessage(MESSAGE_TYPES.GET_FILTER_INFO_BY_CONTENT, { filterContent });
    };

    addCustomFilterByContent = (filterContent: string): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.ADD_CUSTOM_FILTER_BY_CONTENT, { filterContent });
    };
}

export const sender = new Sender();
