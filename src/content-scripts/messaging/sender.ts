import { MESSAGE_TYPES } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export const sender = {
    getCss: () => sendMessage(MESSAGE_TYPES.GET_CSS),
};
