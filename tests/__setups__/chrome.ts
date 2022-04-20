const chrome = require('sinon-chrome');

if (!chrome.runtime.id) {
    chrome.runtime.id = 'test';
}

if (!chrome.declarativeNetRequest) {
    chrome.declarativeNetRequest = {
        MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES: 5000,
        getDynamicRules: () => [],
        updateDynamicRules: () => {},
    };
}

declare global {
    namespace NodeJS {
        interface Global {
            chrome: typeof chrome;
        }
    }
}

global.chrome = chrome;

export {};
