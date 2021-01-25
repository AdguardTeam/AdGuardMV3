import { I18nInterface } from '@adguard/translate';

export const i18n: I18nInterface = {
    getMessage: chrome.i18n.getMessage,
    getUILanguage: chrome.i18n.getUILanguage as I18nInterface['getUILanguage'],
    getBaseMessage: (key: string) => key,
    getBaseUILanguage: () => 'en',
};
