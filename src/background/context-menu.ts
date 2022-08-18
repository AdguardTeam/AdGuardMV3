import { throttle } from 'lodash';
import { nanoid } from 'nanoid';

import { tabUtils } from 'Common/tab-utils';
import { NOTIFIER_EVENTS } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { getUrlDetails } from 'Common/helpers';

import { contextMenus } from './context-menus';
import { settings } from './settings';
import { notifier } from './notifier';
import { tsWebExtensionWrapper } from './tswebextension';
import { userRules } from './userRules';

type Tab = chrome.tabs.Tab;

enum CONTEXT_MENU_ITEMS {
    DISABLE_FILTERING_ON_SITE = 'context_menu_disable_filtering_on_site',
    ENABLE_FILTERING_ON_SITE = 'context_menu_enable_filtering_on_site',
    BLOCK_ADS_ON_SITE = 'context_menu_block_ads_on_site',
    REPORT_AN_ISSUE = 'context_menu_report_an_issue',
    OPEN_OPTIONS = 'context_menu_open_options',
    DISABLE_BLOCKING = 'context_menu_disable_blocking',
    ENABLE_BLOCKING = 'context_menu_enable_blocking',
}

const toggleSiteAllowlistStatus = async (tab?: Tab) => {
    if (!tab || !tab.url) {
        return;
    }

    const { url, id } = tab;
    const urlDetails = getUrlDetails(url);
    if (urlDetails?.domainName) {
        await userRules.toggleSiteAllowlistStatus(urlDetails.domainName);
    }

    await tsWebExtensionWrapper.configure(true);

    if (id !== undefined) {
        await tabUtils.reloadTab(id);
    }
};

const CONTEXT_MENU_MAP = {
    [CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE]: {
        action: toggleSiteAllowlistStatus,
        title: translator.getMessage(CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE),
    },
    [CONTEXT_MENU_ITEMS.ENABLE_FILTERING_ON_SITE]: {
        action: toggleSiteAllowlistStatus,
        title: translator.getMessage(CONTEXT_MENU_ITEMS.ENABLE_FILTERING_ON_SITE),
    },
    [CONTEXT_MENU_ITEMS.BLOCK_ADS_ON_SITE]: {
        action: async (tab?: Tab) => {
            if (tab?.id) {
                await tabUtils.openAssistant(tab.id);
            }
        },
        title: translator.getMessage(CONTEXT_MENU_ITEMS.BLOCK_ADS_ON_SITE),
    },
    [CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE]: {
        action: async (tab?: Tab) => {
            if (tab?.url) {
                await tabUtils.openAbusePage(tab.url, 'context_menu');
            }
        },
        title: translator.getMessage(CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE),
    },
    [CONTEXT_MENU_ITEMS.OPEN_OPTIONS]: {
        action: async () => {
            await tabUtils.openOptionsPage();
        },
        title: translator.getMessage(CONTEXT_MENU_ITEMS.OPEN_OPTIONS),
    },
    [CONTEXT_MENU_ITEMS.DISABLE_BLOCKING]: {
        action: async (tab?: Tab) => {
            await settings.setProtection(false);
            await tsWebExtensionWrapper.stop();
            if (tab?.id) {
                await tabUtils.reloadTab(tab.id);
            }
        },
        title: translator.getMessage(CONTEXT_MENU_ITEMS.DISABLE_BLOCKING),
    },
    [CONTEXT_MENU_ITEMS.ENABLE_BLOCKING]: {
        action: async (tab?: Tab) => {
            await settings.setProtection(true);
            await tsWebExtensionWrapper.start();
            if (tab?.id) {
                await tabUtils.reloadTab(tab.id);
            }
        },
        title: translator.getMessage(CONTEXT_MENU_ITEMS.ENABLE_BLOCKING),
    },
};

const addMenuItem = async (key: CONTEXT_MENU_ITEMS) => {
    const { title } = CONTEXT_MENU_MAP[key];

    const menuItem: chrome.contextMenus.CreateProperties = {
        id: key,
        title,
    };

    await contextMenus.create(menuItem);
};

const addSeparator = async () => {
    await contextMenus.create({
        id: nanoid(),
        type: 'separator',
    });
};

const addContextMenu = async () => {
    const isAllowlisted = await tabUtils.isCurrentTabAllowlisted();
    if (isAllowlisted) {
        await addMenuItem(CONTEXT_MENU_ITEMS.ENABLE_FILTERING_ON_SITE);
    } else {
        await addMenuItem(CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE);
    }
    await addSeparator();
    await addMenuItem(CONTEXT_MENU_ITEMS.BLOCK_ADS_ON_SITE);
    await addMenuItem(CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE);
    await addSeparator();
    await addMenuItem(CONTEXT_MENU_ITEMS.OPEN_OPTIONS);

    if (settings.protectionEnabled) {
        await addMenuItem(CONTEXT_MENU_ITEMS.DISABLE_BLOCKING);
    } else {
        await addMenuItem(CONTEXT_MENU_ITEMS.ENABLE_BLOCKING);
    }
};

const updateContextMenu = (() => {
    let isUpdating = false;

    return async () => {
        if (isUpdating) {
            return;
        }
        isUpdating = true;
        await contextMenus.removeAll();
        await addContextMenu();
        isUpdating = false;
    };
})();

const UPDATE_WAIT_TIMEOUT_MS = 500;
const updateContextMenuThrottled = throttle(updateContextMenu, UPDATE_WAIT_TIMEOUT_MS);

const contextMenuClickHandler = (
    info: chrome.contextMenus.OnClickData,
    tab: chrome.tabs.Tab | undefined,
) => {
    const contextMenu = CONTEXT_MENU_MAP[info?.menuItemId as CONTEXT_MENU_ITEMS];

    if (!contextMenu) {
        return;
    }

    contextMenu.action(tab);
};

const init = () => {
    chrome.contextMenus.onClicked.addListener(contextMenuClickHandler);
    chrome.tabs.onUpdated.addListener(updateContextMenuThrottled);
    chrome.tabs.onActivated.addListener(updateContextMenuThrottled);

    notifier.addEventListener([
        NOTIFIER_EVENTS.PROTECTION_UPDATED,
        NOTIFIER_EVENTS.SET_RULES,
    ], () => {
        updateContextMenuThrottled();
    });

    updateContextMenuThrottled();
};

export const contextMenu = {
    init,
};
