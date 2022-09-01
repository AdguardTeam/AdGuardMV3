import path from 'path';

import { validator } from '@adguard/translate';

import { cliLog } from '../cli-log';
import { areArraysEqual, getLocaleTranslations } from '../helpers';

import {
    BASE_LOCALE,
    LANGUAGES,
    LOCALE_DATA_FILENAME,
    LOCALES_RELATIVE_PATH,
    REQUIRED_LOCALES,
    THRESHOLD_PERCENTAGE,
    translationResultType,
} from './locales-constants';

const LOCALES = Object.keys(LANGUAGES);
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);

/**
 * @typedef Result
 * @property locale
 * @property level - % of translated
 * @property untranslatedStrings
 */

/**
 * Logs translations readiness
 * @param {Result[]} results
 */
const printTranslationsResults = (results: translationResultType[], isMinimum = false) => {
    cliLog.info('Translations readiness:');
    results.forEach((r) => {
        const record = `${r.locale} -- ${r.level}%`;
        if (r.level < THRESHOLD_PERCENTAGE) {
            cliLog.warningRed(record);
            if (r.untranslatedStrings.length > 0) {
                cliLog.warning('  untranslated:');
                r.untranslatedStrings.forEach((str) => {
                    cliLog.warning(`    - ${str}`);
                });
            }
            if (!isMinimum) {
                if (r.invalidTranslations.length > 0) {
                    cliLog.warning('  invalid:');
                    r.invalidTranslations.forEach((obj) => {
                        cliLog.warning(`    - ${obj.key} -- ${obj.error}`);
                    });
                }
            }
        } else {
            cliLog.success(record);
        }
    });
};

// eslint-disable-next-line consistent-return
const validateMessage = (baseKey: string, baseLocaleTranslations: any, localeTranslations: any) => {
    const baseMessageValue = baseLocaleTranslations[baseKey].message;
    const localeMessageValue = localeTranslations[baseKey].message;
    try {
        const isTranslationValid = validator.isTranslationValid(baseMessageValue, localeMessageValue);
        if (!isTranslationValid) {
            throw new Error('Invalid translated string');
        }
    } catch (error) {
        return { key: baseKey, error };
    }
};

/**
 * Checks locales translations readiness
 * @param locales - list of locales
 * @param isInfo - flag for info script
 */
export const checkTranslations = async (
    locales: string[], isInfo: boolean = false,
): Promise<translationResultType[]> => {
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
        const invalidTranslations: { key: string, error: any }[] = [];

        baseMessages.forEach((baseStr) => {
            if (!localeMessages.includes(baseStr)) {
                untranslatedStrings.push(baseStr);
            } else {
                const validationError = validateMessage(baseStr, baseLocaleTranslations, localeTranslations);
                if (validationError) {
                    invalidTranslations.push(validationError);
                }
            }
        });

        const validLocaleMessagesCount = localeMessagesCount - invalidTranslations.length;

        const strictLevel = ((validLocaleMessagesCount / baseMessagesCount) * 100);
        const level = Math.round((strictLevel + Number.EPSILON) * 100) / 100;

        return {
            locale, level, untranslatedStrings, invalidTranslations,
        };
    }));

    const filteredResults = results.filter((result) => {
        return result.level < THRESHOLD_PERCENTAGE;
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
        throw new Error('Locales above should be done for 100%');
    }

    return results;
};
