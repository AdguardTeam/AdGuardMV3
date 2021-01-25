import { MESSAGE_TYPES } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

export const sender = {
    getCss: () => sendMessage(MESSAGE_TYPES.GET_CSS),
};
