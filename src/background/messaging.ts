import { RuleConverter } from '@adguard/tsurlfilter';

import {
    Message,
    MESSAGE_TYPES,
    OptionsData,
    PopupData,
    CATEGORIES,
} from 'Common/constants';
import { log } from 'Common/logger';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { tabUtils } from 'Common/tab-utils';
import { settings } from './settings';
import { notifier } from './notifier';
import { protectionPause } from './protectionPause';
import { filters } from './filters';
import { backend } from './backend';
import { userRules } from './userRules';
import { tsWebExtensionWrapper } from './tswebextension';

/**
 * Message handler used to receive messages and send responses back on background service worker
 * from content-script, popup, option or another pages of extension
 * @param message
 */
export const extensionMessageHandler = async (
    message: Message,
) => {
    const { type, data } = message;

    switch (type) {
        case MESSAGE_TYPES.GET_OPTIONS_DATA: {
            const optionsData: OptionsData = {
                settings: settings.getSettings(),
                filters: await filters.getFilters(),
                categories: CATEGORIES,
            };

            return optionsData;
        }
        case MESSAGE_TYPES.OPEN_OPTIONS: {
            return tabUtils.openOptionsPage();
        }
        case MESSAGE_TYPES.GET_POPUP_DATA: {
            const popupData: PopupData = {
                settings: settings.getSettings(),
                userRules: await userRules.getRules(),
                enableFiltersIds: await filters.getEnableFiltersIds(),
            };
            return popupData;
        }
        case MESSAGE_TYPES.RELOAD_ACTIVE_TAB: {
            await tabUtils.reloadActiveTab();
            break;
        }
        case MESSAGE_TYPES.SET_SETTING: {
            const { key, value } = data;
            settings.setSetting(key, value);

            if (key === SETTINGS_NAMES.PROTECTION_ENABLED) {
                if (value) {
                    await tsWebExtensionWrapper.start();
                } else {
                    await tsWebExtensionWrapper.stop();
                }
            }

            break;
        }
        case MESSAGE_TYPES.REPORT_SITE: {
            const { url } = await tabUtils.getActiveTab();

            if (url) {
                await tabUtils.openAbusePage(url);
            }

            return null;
        }
        case MESSAGE_TYPES.OPEN_ASSISTANT: {
            const { tab } = data;
            await tabUtils.openAssistant(tab.id);
            break;
        }
        case MESSAGE_TYPES.ADD_USER_RULE: {
            const { ruleText } = data;
            await userRules.addRule(ruleText);
            await tsWebExtensionWrapper.configure();

            break;
        }
        case MESSAGE_TYPES.ADD_FILTERING_SUBSCRIPTION: {
            const { url, title } = data;

            let path = 'options.html#customfilters';

            path += `?subscribe=${encodeURIComponent(url)}`;

            if (title) {
                path += `&title=${title}`;
            }

            tabUtils.openOptionsPage(path);

            break;
        }
        case MESSAGE_TYPES.SET_PAUSE_EXPIRES: {
            const { protectionPauseExpires } = data;
            settings.setSetting(SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES, protectionPauseExpires);
            protectionPause.addTimer(protectionPauseExpires);
            break;
        }
        case MESSAGE_TYPES.REMOVE_PROTECTION_PAUSE_TIMER: {
            protectionPause.removeTimer();
            break;
        }
        case MESSAGE_TYPES.ENABLE_FILTER: {
            await filters.enableFilter(data.filterId);
            await tsWebExtensionWrapper.configure();

            break;
        }
        case MESSAGE_TYPES.DISABLE_FILTER: {
            await filters.disableFilter(data.filterId);
            await tsWebExtensionWrapper.configure();

            break;
        }
        case MESSAGE_TYPES.UPDATE_FILTER_TITLE: {
            await filters.updateFilterTitle(data.filterId, data.filterTitle);
            await tsWebExtensionWrapper.configure();

            break;
        }
        case MESSAGE_TYPES.GET_FILTER_INFO_BY_CONTENT: {
            const { filterContent, title } = data;
            const rules = filterContent.split('\n');
            return filters.parseFilterInfo(rules, title);
        }
        case MESSAGE_TYPES.ADD_CUSTOM_FILTER_BY_CONTENT: {
            const { filterContent, title, url } = data;
            const convertedRule = RuleConverter.convertRules(filterContent);
            const filterStrings = convertedRule.split('\n');
            await filters.addCustomFilterByContent(filterStrings, title, url);
            await tsWebExtensionWrapper.configure();

            break;
        }
        case MESSAGE_TYPES.GET_FILTER_CONTENT_BY_URL: {
            const { url } = data;
            const lines = await backend.loadFilterByUrl(url);
            return lines.join('\n');
        }
        case MESSAGE_TYPES.REMOVE_CUSTOM_FILTER_BY_ID: {
            const { filterId } = data;
            await filters.removeFilter(filterId);
            await tsWebExtensionWrapper.configure();

            break;
        }
        case MESSAGE_TYPES.GET_USER_RULES: {
            return userRules.getRules();
        }
        case MESSAGE_TYPES.SET_USER_RULES: {
            await userRules.setUserRules(data.userRules);
            await tsWebExtensionWrapper.configure();

            break;
        }
        // FIXME: Temporary construction for keeping alive service worker
        // via constantly standing message exchange
        case MESSAGE_TYPES.PING: {
            break;
        }
        default: {
            throw new Error(`No message handler for type: ${type}`);
        }
    }

    return null;
};

/**
 * This handler used to subscribe for notifications from popup page
 * https://developer.chrome.com/extensions/messaging#connect
 * We can't use simple one-time connections, because they can intercept each other
 * Causing issues like AG-2074
 */
const longLivedMessageHandler = (port: chrome.runtime.Port) => {
    let listenerId: string;

    log.debug(`Connecting to the port "${port.name}"`);
    port.onMessage.addListener((message) => {
        const { type, data } = message;
        if (type === MESSAGE_TYPES.ADD_LONG_LIVED_CONNECTION) {
            const { events } = data;
            listenerId = notifier.addEventListener(events, (...args: any) => {
                try {
                    port.postMessage({ type: MESSAGE_TYPES.NOTIFY_LISTENERS, data: args });
                } catch (e: any) {
                    log.error(e.message);
                }
            });
        }
    });

    port.onDisconnect.addListener(() => {
        log.debug(`Removing listener: ${listenerId} for port ${port.name}`);
        notifier.removeListener(listenerId);
    });
};

// Singleton handler
const apiMessageHandler = tsWebExtensionWrapper.getMessageHandler();
let inited = false;
let waitForInit: Promise<void> | undefined;

// FIXME fix any
const messageHandlerWrapper = (
    message: any,
    sender: any,
    sendResponse: (response?: any) => void,
) => {
    (async () => {
        if (waitForInit) {
            log.debug('[messageHandlerWrapper]: waiting for init', message);
            await waitForInit;
            waitForInit = undefined;
        }

        if (!inited) {
            log.debug('[messageHandlerWrapper]: start init', message);
            const innerInit = async () => {
                // BUG: filters should initialized before userrules,
                // because otherwise filters will be initialize with
                // one filter from storage - userrules
                await settings.init();
                await filters.init();
                await userRules.init();
                await tsWebExtensionWrapper.start();
            };
            waitForInit = innerInit();
            await waitForInit;
            waitForInit = undefined;

            inited = true;
        }

        log.debug('[messageHandlerWrapper]: handle message', message);

        // TODO: use MESSAGE_HANDLER_NAME
        if (message.handlerName === 'tsWebExtension') {
            return apiMessageHandler(message, sender);
        }
        return extensionMessageHandler(message);
    })()
        .then(sendResponse)
        .catch((e: any) => {
            sendResponse({ error: { message: e.message } });
        });

    return true;
};

export const messaging = {
    init: () => {
        chrome.runtime.onMessage.addListener(messageHandlerWrapper);
        chrome.runtime.onConnect.addListener(longLivedMessageHandler);
    },
};
