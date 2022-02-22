import { MESSAGE_TYPES, OptionsData } from 'Common/constants';
import { sendMessage } from 'Common/helpers';
import { OPTION_SETTINGS_NAMES } from 'Common/settings-constants';

/**
 * Module with methods used to communicate with background service worker
 */
class Sender {
    /**
     * Sets settings value on background service worker by key
     * @param key
     * @param value
     */
    setSetting = (key: keyof OPTION_SETTINGS_NAMES, value: boolean) => sendMessage(
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

    updateFilterTitle = (filterId: number, filterTitle: string): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.UPDATE_FILTER_TITLE, { filterId, filterTitle });
    };

    getFilterInfoByContent = (filterContent: string, title: string): Promise<FilterInfo> => {
        return sendMessage(MESSAGE_TYPES.GET_FILTER_INFO_BY_CONTENT, { filterContent, title });
    };

    getFilterContentByUrl = (url: string): Promise<string> => {
        return sendMessage(MESSAGE_TYPES.GET_FILTER_CONTENT_BY_URL, { url });
    };

    addCustomFilterByContent = (filterContent: string, title: string): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.ADD_CUSTOM_FILTER_BY_CONTENT, { filterContent, title });
    };

    removeCustomFilterById = (filterId: number): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.REMOVE_CUSTOM_FILTER_BY_ID, { filterId });
    };

    getUserRules = (): Promise<string> => {
        return sendMessage(MESSAGE_TYPES.GET_USER_RULES);
    };

    setUserRules = async (userRules: string): Promise<void> => {
        return sendMessage(MESSAGE_TYPES.SET_USER_RULES, { userRules });
    };
}

export const sender = new Sender();
