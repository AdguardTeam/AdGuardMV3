import path from 'path';

import fse from 'fs-extra';

import inputConfig from './config.json';

export type localeUrlType = { locale: string, url: string };
export type localeDataType = { locale: string, data: Buffer };
export type localeMessageType = { [key: string]: { message: string } };
export type translationResultType = {
    locale: string,
    level: number,
    untranslatedStrings: string[],
    invalidTranslations: { key: string, error: any }[],
};

const {
    api_url: API_URL,
    locales_data_format: FORMAT,
    required_locales: REQUIRED_LOCALES,
    twosky_config_path: TWOSKY_CONFIG_PATH,
    source_relative_path: SRC_RELATIVE_PATH,
    persistent_messages: PERSISTENT_MESSAGES,
    threshold_percentage: THRESHOLD_PERCENTAGE,
    locales_data_filename: LOCALE_DATA_FILENAME,
    locales_relative_path: LOCALES_RELATIVE_PATH,
    supported_source_filename_extensions: SRC_FILENAME_EXTENSIONS,
} = inputConfig;

const twoskyPath = path.join(__dirname, TWOSKY_CONFIG_PATH);
const twoskyContent = fse.readFileSync(twoskyPath, { encoding: 'utf8' });
const twoskyConfig = JSON.parse(twoskyContent)[0];
const {
    base_locale: BASE_LOCALE,
    languages: LANGUAGES,
    project_id: PROJECT_ID,
} = twoskyConfig;

/**
 * We use this pairs because we have different locale codes in the crowdin and the extension
 */
const LOCALE_PAIRS: { [key: string]: string } = {
    /**
     * Norvegian language locale code in Crowdin is 'no'
     * Chrome recognizes both locale code 'nb' and 'no',
     * Firefox recognizes only 'nb'
     */
    nb: 'no',
    /**
     * We duplicate es language for Spanish (Latin America and Caribbean)
     */
    es_419: 'es',
} as const;

export {
    BASE_LOCALE,
    LANGUAGES,
    PROJECT_ID,
    TWOSKY_CONFIG_PATH,
    API_URL,
    SRC_RELATIVE_PATH,
    SRC_FILENAME_EXTENSIONS,
    LOCALE_PAIRS,
    PERSISTENT_MESSAGES,
    LOCALES_RELATIVE_PATH,
    FORMAT,
    LOCALE_DATA_FILENAME,
    REQUIRED_LOCALES,
    THRESHOLD_PERCENTAGE,
};
