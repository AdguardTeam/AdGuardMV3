import { MESSAGES } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export default {
    getCss: () => sendMessage(MESSAGES.getCss),
};
