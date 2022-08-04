import {
    MESSAGE_TYPES,
    OptionsData,
    Filter,
    FilterInfo,
} from 'Common/constants/common';
import { OPTION_SETTINGS } from 'Common/constants/settings-constants';
import { sendMessage } from 'Common/helpers';

import type { UserRulesLimits } from '../../background/userRules';

/**
 * Module with methods used to communicate with background service worker
 */
class Sender {
    /**
     * Sets settings value on background service worker by key
     * @param key
     * @param value
     */
    setSetting = (update: Partial<OPTION_SETTINGS>) => sendMessage(
        MESSAGE_TYPES.SET_SETTING, { update },
    );

    /** Retrieves options data from background service worker */
    getOptionsData = () => sendMessage<OptionsData>(MESSAGE_TYPES.GET_OPTIONS_DATA);

    /** Retrieves dynamic rules counters */
    getDynamicRulesCounters = () => sendMessage<UserRulesLimits>(MESSAGE_TYPES.GET_DYNAMIC_RULES_LIMITS);

    /** Relaunch tswebextension after possible filters limit release */
    relaunchFiltering = (filterIds: number[]) => sendMessage(MESSAGE_TYPES.RELAUNCH_FILTERING, { filterIds });

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

    addCustomFilterByContent = (
        filterContent: string, title: string, url: string,
    ): Promise<Filter[]> => {
        return sendMessage(MESSAGE_TYPES.ADD_CUSTOM_FILTER_BY_CONTENT, {
            filterContent, title, url,
        });
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
