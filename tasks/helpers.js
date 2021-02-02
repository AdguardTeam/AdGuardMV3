import fs from 'fs';
import path from 'path';

// TODO refactor using slice
export const chunkArray = (arr, size) => arr.reduce((chunks, el, idx) => {
    if (idx % size === 0) {
        chunks.push([el]);
    } else {
        chunks[chunks.length - 1].push(el);
    }
    return chunks;
}, []);

/**
 * Gets strings for certain locale
 * @param {string} localesDir
 * @param {string} locale
 * @param {string} localesDataFilename
 * @returns {Object}
 */
export const getLocaleTranslations = async (localesDir, locale, localesDataFilename) => {
    const filePath = path.join(localesDir, locale, localesDataFilename);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

/**
 * Compares two arrays
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {boolean}
 */
export const areArraysEqual = (arr1, arr2) => {
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
