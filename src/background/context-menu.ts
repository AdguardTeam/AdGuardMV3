import { throttle } from 'lodash';
import { nanoid } from 'nanoid';

import { tabUtils } from 'Common/tab-utils';
import { contextMenus } from './context-menus';

enum CONTEXT_MENU_ITEMS {
    // FIXME add enabling filtering
    DISABLE_FILTERING_ON_SITE = 'context_menu_disable_filtering_on_site',
    BLOCK_ADS_ON_SITE = 'context_menu_block_ads_on_site',
    REPORT_AN_ISSUE = 'context_menu_report_an_issue',
    OPEN_OPTIONS = 'context_menu_open_options',
    // FIXME add enabling blocking
    PAUSE_BLOCKING = 'context_menu_pause_blocking',
}

// TODO translate context menu items, when this issue would be resolved
//  https://bugs.chromium.org/p/chromium/issues/detail?id=1175053
const CONTEXT_MENU_MAP = {
    [CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE]: {
        action: () => {
            // FIXME add working actions
            console.log(CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE);
        },
        title: CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE,
    },
    [CONTEXT_MENU_ITEMS.BLOCK_ADS_ON_SITE]: {
        action: async (tabId?: number) => {
            if (tabId) {
                await tabUtils.openAssistant(tabId);
            }
        },
        title: CONTEXT_MENU_ITEMS.BLOCK_ADS_ON_SITE,
    },
    [CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE]: {
        action: () => {
            // FIXME add working actions
            console.log(CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE);
        },
        title: CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE,
    },
    [CONTEXT_MENU_ITEMS.OPEN_OPTIONS]: {
        action: () => {
            // FIXME add working actions
            console.log(CONTEXT_MENU_ITEMS.OPEN_OPTIONS);
        },
        title: CONTEXT_MENU_ITEMS.OPEN_OPTIONS,
    },
    [CONTEXT_MENU_ITEMS.PAUSE_BLOCKING]: {
        action: () => {
            // FIXME add working actions
            console.log(CONTEXT_MENU_ITEMS.PAUSE_BLOCKING);
        },
        title: CONTEXT_MENU_ITEMS.PAUSE_BLOCKING,
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
    await addMenuItem(CONTEXT_MENU_ITEMS.DISABLE_FILTERING_ON_SITE);
    await addSeparator();
    await addMenuItem(CONTEXT_MENU_ITEMS.BLOCK_ADS_ON_SITE);
    await addMenuItem(CONTEXT_MENU_ITEMS.REPORT_AN_ISSUE);
    await addSeparator();
    await addMenuItem(CONTEXT_MENU_ITEMS.OPEN_OPTIONS);
    await addMenuItem(CONTEXT_MENU_ITEMS.PAUSE_BLOCKING);
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

    contextMenu.action(tab?.id);
};

const init = () => {
    chrome.contextMenus.onClicked.addListener(contextMenuClickHandler);
    chrome.tabs.onUpdated.addListener(updateContextMenuThrottled);
    chrome.tabs.onActivated.addListener(updateContextMenuThrottled);

    updateContextMenuThrottled();
};

export const contextMenu = {
    init,
};
