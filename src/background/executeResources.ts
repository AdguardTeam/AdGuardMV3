import { CosmeticOption } from '@adguard/tsurlfilter';
import { SETTINGS_NAMES } from 'Common/settings-constants';
import { engine } from './engine';
import { settings } from './settings';

const getScripts = async (url: string) => {
    await engine.init(true);
    return engine.getScriptsStringForUrl(
        url, CosmeticOption.CosmeticOptionAll,
    );
};

const executeScript = async (scripts: string, id: number) => {
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

    chrome.scripting.executeScript({
        target: { tabId: id },
        func: functionToInject,
        // @ts-ignore
        world: 'MAIN', // ISOLATED doesnt allow to execute code inline
        args: [scripts],
    });
};

export const executeResources = {
    init: async () => {
        chrome.webNavigation.onCommitted.addListener(
            async (details) => {
                const filteringEnabled = settings.getSetting(SETTINGS_NAMES.FILTERING_ENABLED);
                const protectionEnabled = settings.getSetting(SETTINGS_NAMES.PROTECTION_ENABLED);

                if (filteringEnabled && protectionEnabled) {
                    const { tabId: id, url } = details;
                    const response = await getScripts(url);
                    executeScript(response, id);
                }
            },
        );
    },
};
