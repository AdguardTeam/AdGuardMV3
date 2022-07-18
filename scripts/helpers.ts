import path from 'path';

import fse from 'fs-extra';

import { ENV_CONF } from './build-constants';
import { localeMessageType, localeUrlType } from './locales/locales-constants';

export const chunkArray = (arr: localeUrlType[], size: number) => arr
    .reduce((chunks: localeUrlType[][], el: localeUrlType, idx: number) => {
        if (idx % size === 0) {
            chunks.push([el]);
        } else {
            chunks[chunks.length - 1].push(el);
        }
        return chunks;
    }, []);

/**
 * Gets strings for certain locale
 */
export const getLocaleTranslations = async (
    localesDir: string, locale: string, localesDataFilename: string,
): Promise<localeMessageType> => {
    const filePath = path.join(localesDir, locale, localesDataFilename);
    const fileContent = await fse.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

/**
 * Compares two arrays
 */
export const areArraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
    if (!arr1 || !arr2) {
        return false;
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i += 1) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

export const getUrlWithQueryString = (url: string, params: { [key: string]: string }) => {
    const searchParams = new URLSearchParams(params);

    return `${url}?${searchParams.toString()}`;
};

export const getEnvConf = (env: string) => {
    const envConfig = ENV_CONF[env];
    if (!envConfig) {
        throw new Error(`No env config for: "${env}"`);
    }
    return envConfig;
};
