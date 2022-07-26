import { I18nInterface } from '@adguard/translate';

export const i18n: I18nInterface = {
    getMessage: chrome.i18n.getMessage,
    getUILanguage: () => 'en',
    getBaseMessage: (key: string) => key,
    getBaseUILanguage: () => 'en',
};
