import {
    Message,
    MESSAGE_TYPES,
    MessageType,
    REPORT_SITE_BASE_URL,
} from 'Common/constants';
import { log } from 'Common/logger';
import { prefs } from 'Common/prefs';
import { getUrlWithQueryString } from 'Common/helpers';
import { scripting } from '../background/scripting';

class TabUtils {
    getActiveTab = (): Promise<chrome.tabs.Tab> => {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const error = chrome.runtime.lastError;
                if (error) {
                    reject(error);
                }

                const [tab] = tabs;
                resolve(tab);
            });
        });
    };

    sendMessageToTab = (tabId: number, type: MessageType, data?: any) => {
        const message: Message = { type };
        if (data) {
            message.data = data;
        }
        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                    return;
                }
                resolve(response);
            });
        });
    };

    private openPage = async (url: string): Promise<void> => {
        if (!url) {
            throw new Error(`Open page requires url, received, ${url}`);
        }
        await chrome.tabs.create({ url });
    };

    openAbusePage = (url: string, filterIds: string[], productVersion: string) => {
        const supportedBrowsers = ['Chrome', 'Firefox', 'Opera', 'Safari', 'IE', 'Edge', 'Yandex'];

        const browserUrlParams = (
            supportedBrowsers.includes(prefs.browser)
                ? { browser: prefs.browser }
                : { browser: 'Other', browserDetails: prefs.browser }
        ) as { browser: string } | { browser: string, browserDetails: string };

        const urlParams = {
            product_type: 'Ext',
            product_version: productVersion,
            ...browserUrlParams,
            url,
            filters: filterIds.join('.'),
        };

        const abuseUrl = getUrlWithQueryString(REPORT_SITE_BASE_URL, urlParams);

        return this.openPage(abuseUrl);
    };

    /**
     * Sends message to assistant by tab id in order to activate it.
     * If no answer received tries to inject assistant script and send message again.
     * @param tabId
     */
    openAssistantWithInject = async (tabId: number) => {
        try {
            await this.sendMessageToTab(tabId, MESSAGE_TYPES.START_ASSISTANT);
        } catch (e) {
            // if assistant wasn't injected yet sendMessageToTab will throw an error
            await scripting.executeScript(tabId, { file: 'assistant.js' });
            await this.sendMessageToTab(tabId, MESSAGE_TYPES.START_ASSISTANT);
        }
    };

    /**
     * Launches assistant context by tab id
     * @param tabId
     */
    openAssistant = async (tabId: number) => {
        try {
            await this.openAssistantWithInject(tabId);
        } catch (e) {
            log.error(e);
        }
    };
}

export const tabUtils = new TabUtils();
