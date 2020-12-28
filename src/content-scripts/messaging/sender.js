import { MESSAGES } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export const sender = {
    getCss: () => sendMessage(MESSAGES.GET_CSS),
};
