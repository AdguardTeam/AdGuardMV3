import { I18nInterface } from '@adguard/translate';

export const i18n: I18nInterface = {
    getMessage: chrome.i18n.getMessage,
    getUILanguage: () => 'en', // TODO: fix in https://jira.adguard.com/browse/AG-15583
    getBaseMessage: (key: string) => key,
    getBaseUILanguage: () => 'en',
};
