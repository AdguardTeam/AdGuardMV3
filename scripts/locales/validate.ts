import path from 'path';

import { validator, Locale } from '@adguard/translate';

import { getErrorMessage } from '../../src/common/error';
import { cliLog } from '../cli-log';
import { areArraysEqual, getLocaleTranslations } from '../helpers';

import { normalizeLanguageCode } from './normalize-language-code';
import {
    BASE_LOCALE,
    LANGUAGES,
    LOCALE_DATA_FILENAME,
    LOCALES_RELATIVE_PATH,
    REQUIRED_LOCALES,
    type TranslationResultType,
    type MessageValidationResult,
} from './locales-constants';

const LOCALES = Object.keys(LANGUAGES);
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);

/**
 * Logs translations readiness
 *
 * @param results List of translations readiness results.
 * @param isMinimum Flag for minimum locales to check, limited to the required locales.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const printTranslationsResults = (results: TranslationResultType[], isMinimum = false): void => {
    cliLog.info('Translations readiness:');
    results.forEach((r) => {
        const record = `${r.locale} -- ${r.level}%`;

        const {
            untranslatedPluralStrings,
            invalidTranslations,
        } = r;

        if (untranslatedPluralStrings.length > 0 || invalidTranslations.length > 0) {
            cliLog.warningRed(record);

            if (untranslatedPluralStrings.length > 0) {
                cliLog.warning('  untranslated:');
                untranslatedPluralStrings.forEach((str) => {
                    cliLog.warning(`    - ${str}`);
                });
            }

            if (invalidTranslations.length > 0) {
                cliLog.warning('  invalid:');
                invalidTranslations.forEach((obj) => {
                    cliLog.warning(`    - ${obj.key} -- ${obj.error}`);
                });
            }
        } else {
            cliLog.success(record);
        }
    });
};

/**
 * Validates that localized string correspond by structure to base locale string.
 *
 * @param baseKey Key of the base locale string.
 * @param baseLocaleTranslations Translations of the base locale.
 * @param rawLocale Locale to validate.
 * @param localeTranslations Translations of the locale to validate.
 *
 * @returns Validation result if error occurred, otherwise undefined.
 */
const validateMessage = (
    baseKey: string,
    baseLocaleTranslations: any,
    rawLocale: string,
    localeTranslations: any,
): MessageValidationResult | undefined => {
    const baseMessageValue = baseLocaleTranslations[baseKey].message;
    const localeMessageValue = localeTranslations[baseKey].message;
    // locale should be lowercase, e.g. 'pt_br', not 'pt_BR'
    const locale: Locale = normalizeLanguageCode(rawLocale);

    let validation: MessageValidationResult | undefined;
    try {
        if (!validator.isTranslationValid(
            baseMessageValue,
            localeMessageValue,
            locale,
        )) {
            throw new Error('Invalid translation');
        }
    } catch (e: unknown) {
        validation = { key: baseKey, error: getErrorMessage(e) };
    }
    return validation;
};

/**
 * Checks locales translations readiness
 * @param locales - list of locales
 * @param isInfo - flag for info script
 */
export const checkTranslations = async (
    locales: string[], isInfo: boolean = false,
): Promise<TranslationResultType[]> => {
    const baseLocaleTranslations = await getLocaleTranslations(
        LOCALES_DIR, BASE_LOCALE, LOCALE_DATA_FILENAME,
    );
    const baseMessages = Object.keys(baseLocaleTranslations);
    const baseMessagesCount = baseMessages.length;

    const results = await Promise.all(locales.map(async (locale) => {
        const localeTranslations = await getLocaleTranslations(
            LOCALES_DIR, locale, LOCALE_DATA_FILENAME,
        );
        const localeMessages = Object.keys(localeTranslations);
        const localeMessagesCount = localeMessages.length;

        const untranslatedStrings: string[] = [];
        const untranslatedPluralStrings: string[] = [];
        const invalidTranslations: { key: string, error: any }[] = [];

        baseMessages.forEach((baseStrKey: string) => {
            if (!localeMessages.includes(baseStrKey)) {
                if (baseLocaleTranslations[baseStrKey].message.includes('|')) {
                    untranslatedPluralStrings.push(baseStrKey);
                } else {
                    untranslatedStrings.push(baseStrKey);
                }
            } else {
                const validationError = validateMessage(baseStrKey, baseLocaleTranslations, locale, localeTranslations);
                if (validationError) {
                    invalidTranslations.push(validationError);
                }
            }
        });

        const validLocaleMessagesCount = localeMessagesCount - invalidTranslations.length;

        const strictLevel = ((validLocaleMessagesCount / baseMessagesCount) * 100);
        const level = Math.round((strictLevel + Number.EPSILON) * 100) / 100;

        return {
            locale,
            level,
            untranslatedPluralStrings,
            untranslatedStrings,
            invalidTranslations,
        };
    }));

    const filteredResults = results.filter((result) => {
        return result.untranslatedPluralStrings.length > 0 || result.invalidTranslations.length > 0;
    });

    if (isInfo) {
        printTranslationsResults(results);
    } else if (filteredResults.length === 0) {
        let message = `Level of translations is required for locales: ${locales.join(', ')}`;
        if (areArraysEqual(locales, LOCALES)) {
            message = 'All locales have required level of translations';
        } else if (areArraysEqual(locales, REQUIRED_LOCALES)) {
            message = 'Our locales have required level of translations';
        }
        cliLog.success(message);
    } else {
        printTranslationsResults(filteredResults);
        // We should detect untranslated strings because they can throw an error
        // in runtime, because translator cannot validate plural form of base
        // 'en' message for different locale, e.g. 'ru'.
        if (filteredResults.some((r) => r.untranslatedStrings.some((s) => s.includes('|')))) {
            throw new Error('Locales above should be done for 100%');
        } else {
            throw new Error('Locales above should be fixed');
        }
    }

    return results;
};
