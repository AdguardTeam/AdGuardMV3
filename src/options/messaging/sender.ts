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
}

export const sender = new Sender();
