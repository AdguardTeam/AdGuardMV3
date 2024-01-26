import type { I18nInterface, Locale } from '@adguard/translate';

/** Represents an individual message entry */
type MessageEntry = { message: string };

/** Represents the structure of base messages, where any string can be a key */
type BaseMessages = { [key: string]: MessageEntry };

const baseMessages: BaseMessages = require('../../_locales/en/messages.json');

const BASE_LOCALE = 'en';

const uiLanguage = chrome.i18n.getUILanguage();

export const i18n: I18nInterface = {
    /**
     * Retrieves the localized message for the given key.
     * @param key - The key corresponding to the message in the localization files.
     * @returns The localized message, or an empty string if the message is the same as the base locale (indicating no
     * translation).
     * @throws {Error} If there is no such key in the messages.
     */
    getMessage: (key: string) => {
        const receivedMessage = chrome.i18n.getMessage(key);

        if (uiLanguage !== BASE_LOCALE) {
            const baseMessage = baseMessages[key]?.message;
            if (!baseMessage) {
                throw new Error(`There is no such key "${key}" in the messages`);
            }
            // The same strings mean that the message is not translated.
            // We return an empty string for @adguard/translator to fall back to the base message and base locale.
            // Without this, browser.i18n.getMessage returns the base locale message and the wrong UI language,
            // and @adguard/translator fails on plural forms validations.
            if (receivedMessage === baseMessage) {
                console.debug('Possible error with plural form:', receivedMessage, key);
                return '';
            }
        }

        return receivedMessage;
    },
    /**
     * Retrieves the UI language, truncated to a 2-letter code.
     * This is because react translator supports only 2-letter codes.
     *
     * @returns The 2-letter UI language code.
     */
    getUILanguage: () => {
        return uiLanguage.substring(0, 2) as Locale;
    },
    getBaseMessage: (key: string) => {
        // thus we can test the base messages with keys without translations
        if (process.env.NODE_ENV === 'test') {
            return key;
        }
        return chrome.i18n.getMessage(key);
    },
    getBaseUILanguage: () => BASE_LOCALE,
};
