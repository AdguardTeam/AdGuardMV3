import { MESSAGE_TYPES } from 'Common/constants';
import { sendMessage } from 'Common/helpers';

interface Response {
    css: string[];
    extendedCss: string[];
}

export const sender = {
    getCss: (url: string) => sendMessage<Response>(
        MESSAGE_TYPES.GET_CSS, { url },
    ),
};
