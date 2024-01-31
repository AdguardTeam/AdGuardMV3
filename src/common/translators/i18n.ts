import type { ReactNode } from 'react';
import type { I18nInterface, Locale, Translator } from '@adguard/translate';

/** Represents an individual message entry */
type MessageEntry = { message: string };

/** Represents the structure of base messages, where any string can be a key */
type BaseMessages = { [key: string]: MessageEntry };

const baseMessages: BaseMessages = require('../../_locales/en/messages.json');

const BASE_LOCALE = 'en';

const uiLanguage = chrome.i18n.getUILanguage();

type I18nInterfaceWithIgnore = I18nInterface & {
    ignoreTranslatesForKeys: string[];
};

export const i18n: I18nInterfaceWithIgnore = {
    /**
     * For some cases when we have invalid plural form to some locale we should
     * ignore this key for the next call of extracting message to force extract
     * base message from the base locale.
     */
    ignoreTranslatesForKeys: [],

    /**
     * Retrieves the localized message for the given key.
     * @param key - The key corresponding to the message in the localization files.
     * @returns The localized message, or an empty string if the message is the same as the base locale (indicating no
     * translation).
     * @throws {Error} If there is no such key in the messages.
     */
    getMessage: (key: string) => {
        if (i18n.ignoreTranslatesForKeys.includes(key)) {
            return '';
        }

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
                // eslint-disable-next-line no-console
                console.debug('Possible untranslated message for key: ', key);
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
        return baseMessages[key]?.message;
    },
    getBaseUILanguage: () => BASE_LOCALE,
};

/**
 * When we use @adguard/translator, we need to add a wrapper for getPlural method
 * to catch errors with invalid plural forms, because translator will try
 * to use locale message with base locale plural form - it will be wrong.
 * So we need to ignore this key for the next time to force extract base message.
 * This happens in version 1.0.2 of @adguard/translator.
 *
 * @param t Return type of @adguard/translate.createTranslator.
 *
 * @returns Modified translator with try-catch wrapper for getPlural method.
 */
export function addWrapperForGetPlural<T = string | ReactNode>(t: Translator<T>): Translator<T> {
    const originalGetPlural = t.getPlural;

    // eslint-disable-next-line no-param-reassign
    t.getPlural = (key, count) => {
        try {
            return originalGetPlural.call(t, key, count);
        } catch (e) {
            // When we caught an error with invalid plural forms,
            // we ignore this key for the next time to force extract base message
            // from the base locale and use it's plural form.
            if (e instanceof Error && e.message.includes('Invalid plural string')) {
                // eslint-disable-next-line no-console
                console.debug('Possible invalid plural message for key: ', key);
                i18n.ignoreTranslatesForKeys.push(key);
                const baseLanguagePluralMessage = originalGetPlural.call(t, key, count);
                i18n.ignoreTranslatesForKeys = i18n.ignoreTranslatesForKeys.filter((s) => s !== key);
                return baseLanguagePluralMessage;
            }
            throw e;
        }
    };

    return t;
}
