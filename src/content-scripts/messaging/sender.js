import { MESSAGES } from '../../common/constants';
import { sendMessage } from '../../common/helpers';

export default {
    getCss: (callback) => sendMessage(
        MESSAGES.getCss, undefined,
        callback
    ),
};
