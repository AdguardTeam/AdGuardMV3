import fs from 'fs';
import path from 'path';
import { localeMessageType, localeUrlType } from './locales/constants';

// TODO refactor using slice
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
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
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
