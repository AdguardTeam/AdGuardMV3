import { adguardAssistant } from '@adguard/assistant';

import { MESSAGE_TYPES } from 'Common/constants/common';
import { sendMessage } from 'Common/helpers';

const init = () => {
    let assistant: any;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === MESSAGE_TYPES.START_ASSISTANT) {
            if (typeof assistant === 'undefined') {
                assistant = adguardAssistant();
            } else {
                assistant.close();
            }

            // TODO add selected element, when context menu will be ready
            assistant.start(null, async (ruleText: string) => {
                await sendMessage(MESSAGE_TYPES.ADD_USER_RULE_FROM_ASSISTANT, { ruleText });
            });
            sendResponse(true);
        }
        sendResponse(null);
    });
};

export const assistant = {
    init,
};
