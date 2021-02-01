import { MESSAGE_TYPES, OptionsData } from 'Common/constants';
import { sendMessage } from 'Common/helpers';
import { SETTINGS_NAMES } from '../../background/settings/settings-constants';

class Sender {
    setSetting = (key: SETTINGS_NAMES, value: boolean) => sendMessage(
        MESSAGE_TYPES.SET_SETTING, { key, value },
    );

    getOptionsData = () => sendMessage<OptionsData>(MESSAGE_TYPES.GET_OPTIONS_DATA);
}

export const sender = new Sender();
