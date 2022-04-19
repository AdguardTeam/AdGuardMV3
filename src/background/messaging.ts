import * as TSUrlFilter from '@adguard/tsurlfilter';
import { CosmeticOption } from '@adguard/tsurlfilter';
import {
    Message,
    MESSAGE_TYPES,
    OptionsData,
    PopupData,
} from 'Common/constants';
import { log } from 'Common/logger';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { tabUtils } from 'Common/tab-utils';
import { settings } from './settings';
import { app } from './app';
import { notifier } from './notifier';
import { protectionPause } from './protectionPause';
import { filters } from './filters';
import { categories } from './categories';
import { backend } from './backend';
import { userRules } from './userRules';
import { engine } from './engine';

interface MessageHandler {
    (message: Message, sender: chrome.runtime.MessageSender): any;
}

/**
 * Message handler wrapper used in order to handle async/await calls,
 * because chrome api by default do not support them
 * @param messageHandler
 */
const messageHandlerWrapper = (messageHandler: MessageHandler) => (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (...args: any[]) => void,
) => {
    (async () => {
        try {
            const response = await messageHandler(message, sender);
            sendResponse(response);
        } catch (e: any) {
            sendResponse({ error: { message: e.message } });
        }
    })();
    return true;
};

/**
 * Message handler used to receive messages and send responses back on background service worker
 * from content-script, popup, option or another pages of extension
 * @param message
 */
export const messageHandler = async (
    message: Message,
    // eslint-disable-next-line consistent-return
) => {
    await app.init();

    const { type, data } = message;

    switch (type) {
        case MESSAGE_TYPES.GET_OPTIONS_DATA: {
            const optionsData: OptionsData = {
                settings: settings.getSettings(),
                filters: await filters.getFilters(),
                categories: categories.getCategories(),
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
        case MESSAGE_TYPES.GET_CSS: {
            await engine.init();

            const filteringEnabled = settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED);
            const protectionEnabled = settings.getSetting(SETTINGS_NAMES.PROTECTION_ENABLED);

            if (filteringEnabled && protectionEnabled) {
                const selectors = engine.getSelectorsForUrl(
                    data.url, CosmeticOption.CosmeticOptionAll, false, false,
                );

                return selectors;
            }

            return null;
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
            return filters.enableFilter(data.filterId);
        }
        case MESSAGE_TYPES.DISABLE_FILTER: {
            return filters.disableFilter(data.filterId);
        }
        case MESSAGE_TYPES.UPDATE_FILTER_TITLE: {
            return filters.updateFilterTitle(data.filterId, data.filterTitle);
        }
        case MESSAGE_TYPES.GET_FILTER_INFO_BY_CONTENT: {
            const { filterContent, title } = data;
            const rules = filterContent.split('\n');
            return filters.parseFilterInfo(rules, title);
        }
        case MESSAGE_TYPES.ADD_CUSTOM_FILTER_BY_CONTENT: {
            const { filterContent, title, url } = data;
            const convertedRule = TSUrlFilter.RuleConverter.convertRules(filterContent);
            const filterStrings = convertedRule.split('\n');
            return filters.addCustomFilterByContent(filterStrings, title, url);
        }
        case MESSAGE_TYPES.GET_FILTER_CONTENT_BY_URL: {
            const { url } = data;
            const lines = await backend.loadFilterByUrl(url);
            return lines.join('\n');
        }
        case MESSAGE_TYPES.REMOVE_CUSTOM_FILTER_BY_ID: {
            const { filterId } = data;
            return filters.removeFilter(filterId);
        }
        case MESSAGE_TYPES.GET_USER_RULES: {
            return userRules.getRules();
        }
        case MESSAGE_TYPES.SET_USER_RULES: {
            return userRules.setUserRules(data.userRules);
        }
        default: {
            throw new Error(`No message handler for type: ${type}`);
        }
    }
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

export const messaging = {
    init: () => {
        const messageListener = messageHandlerWrapper(messageHandler);
        chrome.runtime.onMessage.addListener(messageListener);
        chrome.runtime.onConnect.addListener(longLivedMessageHandler);
    },
};
