import { CosmeticOption } from '@adguard/tsurlfilter';
import { isHttpRequest } from 'Common/helpers';
import { log } from 'Common/logger';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { engine } from './engine';
import { settings } from './settings';

const getScripts = async (url: string) => {
    await engine.init(true);
    return engine.getScriptsStringForUrl(url, CosmeticOption.CosmeticOptionAll);
};

const getScriptletsDataList = async (url: string) => {
    await engine.init();
    return engine.getScriptletsDataForUrl(url, CosmeticOption.CosmeticOptionAll);
};

const executeScript = async (scripts: string, tabId: number) => {
    if (scripts.length === 0) {
        return;
    }

    const functionToInject = (script: string) => {
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'text/javascript');
        scriptTag.textContent = script;

        const parent = document.head || document.documentElement;
        parent.appendChild(scriptTag);
        if (scriptTag.parentNode) {
            scriptTag.parentNode.removeChild(scriptTag);
        }
    };

    await chrome.scripting.executeScript({
        target: { tabId },
        func: functionToInject,
        // @ts-ignore
        world: 'MAIN', // ISOLATED doesnt allow to execute code inline
        args: [scripts],
    }, () => {
        if (chrome.runtime.lastError) {
            log.debug(chrome.runtime.lastError);
        }
    });
};

/**
 * Executes scriptlets data via chrome.scripting.executeScript api
 * @param tabId
 * @param scriptletsData
 */
const executeScriptletsData = async (
    tabId: number,
    // TODO export ScriptletData from tsurlfilter
    // @ts-ignore
    scriptletsData: (ScriptletData | null)[],
) => {
    const promises = scriptletsData.map(async (scriptletData) => {
        if (scriptletData === null) {
            return;
        }

        await chrome.scripting.executeScript({
            target: { tabId },
            func: scriptletData.func,
            args: [scriptletData.params, scriptletData.params.args],
            // @ts-ignore
            world: 'MAIN',
        });
    });

    await Promise.all(promises);
};

/**
 * Get scripts and executing them
 * @param id
 * @param url
 */
const getAndExecuteScripts = async (id: number, url: string) => {
    const filteringEnabled = settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED);
    const protectionEnabled = settings.getSetting(SETTINGS_NAMES.PROTECTION_ENABLED);
    const NEW_TAB_PAGE = 'new-tab-page'; // the url from the details have http even on the new tab page

    if (filteringEnabled
        && protectionEnabled
        && isHttpRequest(url)
        && !url.includes(NEW_TAB_PAGE)
    ) {
        const response = await getScripts(url);
        await executeScript(response, id);

        const scriptletData = await getScriptletsDataList(url);
        await executeScriptletsData(id, scriptletData);
    }
};

export const executeResources = {
    /**
     * Init function should be synchronous, because chrome.webNavigation.onCommitted is required to
     * be on the top level in order to wake up service worker
     */
    init: () => {
        chrome.webNavigation.onCommitted.addListener(
            async (details) => {
                try {
                    await getAndExecuteScripts(details.tabId, details.url);
                } catch (e: any) {
                    log.info(e.message);
                }
            },
        );
    },
};
