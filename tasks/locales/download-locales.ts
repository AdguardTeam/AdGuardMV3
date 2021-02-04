/**
 * This task updates locales in repository
 */
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { cliLog } from '../cli-log';

import {
    API_URL,
    BASE_LOCALE,
    LANGUAGES,
    LOCALE_DATA_FILENAME,
    LOCALE_PAIRS,
    LOCALES_RELATIVE_PATH,
    PERSISTENT_MESSAGES,
    PROJECT_ID,
} from './locales-constants';
import { chunkArray, getLocaleTranslations, getUrlWithQueryString } from '../helpers';
import { localeDataType, localeMessageType, localeUrlType } from './constants';

const LOCALES_DOWNLOAD_URL = `${API_URL}/download`;
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);

const LOCALES = Object.keys(LANGUAGES);

const downloadMessagesByUrl = async (url: string): Promise<Buffer> | never => {
    try {
        cliLog.info(`Downloading url: ${url}...`);
        const response = await axios.get<Buffer>(url, { responseType: 'arraybuffer' });
        cliLog.info(`Downloaded: ${url}`);
        return response.data;
    } catch (e) {
        let errorMessage;
        if (e.response && e.response.data) {
            const decoder = new TextDecoder();
            errorMessage = decoder.decode(e.response.data);
        } else {
            errorMessage = e.message;
        }
        cliLog.error(`Error occurred: ${errorMessage}, while downloading: ${url}`);
        throw errorMessage;
    }
};

const promiseBatchMap = async (
    arr: localeUrlType[],
    batchSize: number,
    handler: (localeUrlPair: localeUrlType) => Promise<localeDataType>,
): Promise<localeDataType[]> => {
    const batches: localeUrlType[][] = chunkArray(arr, batchSize);

    const result: localeDataType[][] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const batch of batches) {
        const promises = batch.map(handler);
        // eslint-disable-next-line no-await-in-loop
        const data = await Promise.all(promises);
        result.push(data);
    }

    return result.flat(1);
};

const downloadLocales = async (locales: string[]) => {
    const localeUrlPairs = locales.map((locale: string): localeUrlType => {
        const crowdinLocale = LOCALE_PAIRS[locale] || locale;
        const downloadUrl = getUrlWithQueryString(LOCALES_DOWNLOAD_URL, {
            language: crowdinLocale,
            filename: LOCALE_DATA_FILENAME,
            project: PROJECT_ID,
        });
        return { locale, url: downloadUrl };
    });

    // Decrease this value if you encounter error:
    // "Maximum number of concurrent requests for this endpoint is reached"
    // https://support.crowdin.com/api/api-integration-setup/#rate-limits
    const LOCALES_DOWNLOAD_BATCH_SIZE = 20;

    return promiseBatchMap(localeUrlPairs, LOCALES_DOWNLOAD_BATCH_SIZE,
        async (localeUrlPair) => {
            const { locale, url } = localeUrlPair;
            const data = await downloadMessagesByUrl(url);
            return { locale, data };
        });
};

const saveFile = async (filePath: string, data: Buffer) => {
    try {
        await fs.promises.writeFile(filePath, data);
    } catch (e) {
        cliLog.error(`Was unable do save data in path: ${filePath}. Error: ${e.message}`);
    }
};

const saveLocales = async (localeDataPairs: localeDataType[]) => {
    const promises = localeDataPairs.map((localeDataPair) => {
        const { locale, data } = localeDataPair;
        const localeFilePath = path.join(LOCALES_DIR, locale, LOCALE_DATA_FILENAME);
        const localeDirPath = path.join(LOCALES_DIR, locale);
        if (!fs.existsSync(localeDirPath)) {
            fs.mkdirSync(localeDirPath);
        }
        return saveFile(localeFilePath, data);
    });

    return Promise.all(promises);
};

/**
 * Checks messages for required locales, if doesn't find them, then adds from baseMessages
 * @param locale - locale
 * @param messages - locale messages
 * @param baseMessages - base locale messages
 */
const checkRequiredFields = (
    locale: string,
    messages: localeMessageType,
    baseMessages: localeMessageType,
) => {
    const requiredFields = PERSISTENT_MESSAGES;
    const resultMessages = { ...messages };
    requiredFields.forEach((requiredField) => {
        const fieldData = resultMessages[requiredField];
        if (!fieldData) {
            cliLog.info(` - "${locale}" locale does't have required field: "${requiredField}"`);
            cliLog.info('   Will be added message from base locale');
            resultMessages[requiredField] = baseMessages[requiredField];
        }
    });
    return resultMessages;
};

const validateRequiredFields = async () => {
    const baseMessages = await getLocaleTranslations(
        LOCALES_DIR, BASE_LOCALE, LOCALE_DATA_FILENAME,
    );
    const promises = LOCALES.map(async (locale) => {
        const pathToLocale = path.join(LOCALES_DIR, locale, LOCALE_DATA_FILENAME);
        const messages = JSON.parse(await fs.promises.readFile(pathToLocale, 'utf-8'));
        const checkedMessages = checkRequiredFields(locale, messages, baseMessages);
        const checkedMessagesString = JSON.stringify(checkedMessages, null, 4).replace(/\//g, '\\/');
        await fs.promises.writeFile(pathToLocale, checkedMessagesString);
    });
    await Promise.all(promises).catch((e) => {
        cliLog.error(e);
    });
};

export const downloadAndSave = async (locales: string[]) => {
    const localeDataPairs = await downloadLocales(locales);
    await saveLocales(localeDataPairs);
    await validateRequiredFields();
};
