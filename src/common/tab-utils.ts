import { Message, MessageType, REPORT_SITE_BASE_URL } from 'Common/constants';
import { log } from 'Common/logger';
import { prefs } from 'Common/prefs';
import { getPathWithQueryString } from 'Common/helpers';

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
            log.debug(`Sent to tabId: "${tabId}" message:`, message);
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                    return;
                }
                log.info(`From ${tabId} received response: `, response, 'on message:', message.type);
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

        const abuseUrl = getPathWithQueryString(REPORT_SITE_BASE_URL, urlParams);

        return this.openPage(abuseUrl);
    };
}

export const tabUtils = new TabUtils();
