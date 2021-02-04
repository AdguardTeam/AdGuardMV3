import path from 'path';

import { cliLog } from '../cli-log';

import {
    BASE_LOCALE,
    LANGUAGES,
    LOCALE_DATA_FILENAME,
    LOCALES_RELATIVE_PATH,
    REQUIRED_LOCALES,
    THRESHOLD_PERCENTAGE,
} from './locales-constants';
import { areArraysEqual, getLocaleTranslations } from '../helpers';
import { translationResultType } from './constants';

const LOCALES = Object.keys(LANGUAGES);
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);

/**
 * Logs translations readiness
 */
const printTranslationsResults = (results: translationResultType[]) => {
    cliLog.info('Translations readiness:');
    results.forEach((res) => {
        const record = `${res.locale} -- ${res.level}%`;
        if (res.level < THRESHOLD_PERCENTAGE) {
            cliLog.warningRed(record);
            res.untranslatedStrings.forEach((str) => {
                cliLog.warning(`  ${str}`);
            });
        } else {
            cliLog.success(record);
        }
    });
};

/**
 * Checks locales translations readiness
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

        const strictLevel = ((localeMessagesCount / baseMessagesCount) * 100);
        const level = Math.round((strictLevel + Number.EPSILON) * 100) / 100;

        const untranslatedStrings: string[] = [];
        baseMessages.forEach((baseStr) => {
            if (!localeMessages.includes(baseStr)) {
                untranslatedStrings.push(baseStr);
            }
        });

        return { locale, level, untranslatedStrings };
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
