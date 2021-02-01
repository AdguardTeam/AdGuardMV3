import { sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES, PopupData } from 'Common/constants';
import { SETTINGS_NAMES } from '../../background/settings/settings-constants';

class Sender {
    getPopupData = () => sendMessage<PopupData>(MESSAGE_TYPES.GET_POPUP_DATA);

    openOptions = () => sendMessage(MESSAGE_TYPES.OPEN_OPTIONS);

    setSetting = (key: SETTINGS_NAMES, value: boolean) => sendMessage(
        MESSAGE_TYPES.SET_SETTING,
        { key, value },
    );
}

export const sender = new Sender();
