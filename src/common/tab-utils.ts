import { Message, MessageType } from 'Common/constants/common';
import { REPORT_SITE_BASE } from 'Common/constants/urls';
import { prefs } from 'Common/prefs';
import { getUrlDetails, getUrlWithQueryString } from 'Common/helpers';

import { filters } from '../background/filters';
import { userRules } from '../background/userRules';

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

    openAbusePage = async (url: string, from: string) => {
        const supportedBrowsers = ['Chrome', 'Firefox', 'Opera', 'Safari', 'IE', 'Edge', 'Yandex'];

        const browserUrlParams = (
            supportedBrowsers.includes(prefs.browser)
                ? { browser: prefs.browser }
                : { browser: 'Other', browserDetails: prefs.browser }
        ) as { browser: string } | { browser: string, browserDetails: string };

        const { version } = chrome.runtime.getManifest();

        const filtersIds = await filters.getEnableFiltersIds();

        const urlParams = {
            product_type: 'Ext',
            product_version: version,
            ...browserUrlParams,
            from, // for tds
            url,
            filters: filtersIds.join('.'),
        };

        const abuseUrl = getUrlWithQueryString(REPORT_SITE_BASE, urlParams);

        return this.openPage(abuseUrl);
    };

    /**
     * opens the options page and makes it active
     * @param path - if exists, updates the url of the current tab
     */

    openOptionsPage = (path?: string) => {
        chrome.runtime.openOptionsPage(async () => {
            const { id, url } = await this.getActiveTab();
            if (path && id) {
                this.updateTab(id, path);
                if (url?.includes(chrome.runtime.id)) {
                    this.reloadActiveTab();
                }
            }
        });
    };

    reloadTab = (tabId: number) => {
        return new Promise<void>((resolve, reject) => {
            chrome.tabs.reload(tabId, {}, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                }
                resolve();
            });
        });
    };

    reloadActiveTab = async () => {
        const tab = await this.getActiveTab();

        if (tab?.id) {
            await this.reloadTab(tab.id);
        }
    };

    updateTab = (tabId: number, path: string) => {
        return chrome.tabs.update(tabId, { url: path });
    };

    onActivated = (callback: (activeInfo: chrome.tabs.TabActiveInfo) => void) => (
        chrome.tabs.onActivated.addListener((activeInfo) => callback(activeInfo))
    );

    onUpdated = (callback: (tabId: number) => void) => (
        chrome.tabs.onUpdated.addListener((tabId) => callback(tabId))
    );

    isCurrentTabAllowlisted = async (): Promise<boolean> => {
        let tab;
        try {
            tab = await this.getActiveTab();
        } catch (e) {
            return false;
        }
        if (!tab?.url) {
            return false;
        }

        const urlDetails = getUrlDetails(tab.url);
        if (!urlDetails) {
            return false;
        }

        const currentAllowRule = await userRules.getSiteAllowRule(urlDetails.domainName);
        return currentAllowRule?.enabled || false;
    };
}

export const tabUtils = new TabUtils();
