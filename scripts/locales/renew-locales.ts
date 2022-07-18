import fs from 'fs/promises';
import path from 'path';

import _ from 'lodash';

import { cliLog } from '../cli-log';
import { getLocaleTranslations } from '../helpers';

import {
    BASE_LOCALE,
    LOCALES_RELATIVE_PATH,
    LOCALE_DATA_FILENAME,
    SRC_RELATIVE_PATH,
    SRC_FILENAME_EXTENSIONS,
    PERSISTENT_MESSAGES,
    localeMessageType,
} from './locales-constants';

const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);
const SRC_DIR = path.resolve(__dirname, SRC_RELATIVE_PATH);

/**
 * Search configuration
 */
const configuration = {
    src: path.join(LOCALES_DIR, `${BASE_LOCALE}/${LOCALE_DATA_FILENAME}`), // Base language json
    targets: [SRC_DIR], // Directory to search occurrences
    output: path.join(LOCALES_DIR, `${BASE_LOCALE}/${LOCALE_DATA_FILENAME}`), // Place to put result
    filesReg: `(${SRC_FILENAME_EXTENSIONS.join('|')})$`,
    // messages used in extensions localisations e.g. __MSG_short_name__
    persistedMessages: PERSISTENT_MESSAGES,
};

/**
 * Promise wrapper for writing in file
 */
const writeInFile = (
    filename: string, body: { [key: string]: { [key: string]: string } } | string,
) => {
    if (typeof body !== 'string') {
        // eslint-disable-next-line no-param-reassign
        body = JSON.stringify(body, null, 4);
    }
    return fs.writeFile(filename, body);
};

/**
 * Finds files paths within directory corresponding to filesReg
 */
const findFilesPaths = async (directory: string, filesReg: string) => {
    const filterRegexp = new RegExp(filesReg);
    const walk = async (dir: string, filePaths: string[] = []) => {
        const files = await fs.readdir(dir);

        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            const filePath = path.join(dir, file);
            // eslint-disable-next-line no-await-in-loop
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                // eslint-disable-next-line no-param-reassign, no-await-in-loop
                filePaths = await walk(filePath, filePaths);
            } else if (filePath.match(filterRegexp)) {
                filePaths.push(filePath);
            }
        }
        return filePaths;
    };
    return walk(directory);
};

const getFilesPathsList = async (targets: string[], filesReg: string) => {
    const filesListsPromises = targets.map(async (directory) => {
        return findFilesPaths(directory, filesReg);
    });
    return Promise
        .all(filesListsPromises)
        .then((filesLists) => {
            return filesLists.reduce((uniqueFiles, filesList) => {
                return [...new Set([...uniqueFiles, ...filesList])];
            }, []);
        });
};

const filterMessages = (messages: string[], content: Buffer) => {
    return messages.filter((message) => {
        return content.indexOf(message) > -1;
    });
};

const chooseMessagesFromFiles = async (
    messageKeys: string[], targets: string[], filesReg: string,
) => {
    const filesPaths = await getFilesPathsList(targets, filesReg);
    const filteredMessages = filesPaths.map(async (filePath) => {
        const fileContent = await fs.readFile(filePath);
        return filterMessages(messageKeys, fileContent);
    });
    return Promise
        .all(filteredMessages)
        .then((messages) => {
            return [...messages.reduce((unique: Set<string>, messageArray: string[]) => {
                return new Set([...unique, ...messageArray]);
            }, new Set())];
        });
};

/**
 * Initialization of search process
 */
export const renewLocales = async () => {
    const { targets } = configuration;
    const {
        src,
        output = 'result.json',
        filesReg = '.html$',
        persistedMessages = [],
    } = configuration;

    if (!src) {
        throw new Error('No source path');
    }

    if (!targets || !targets.length) {
        throw new Error('No target directories');
    }

    const source = await getLocaleTranslations(
        LOCALES_DIR, BASE_LOCALE, LOCALE_DATA_FILENAME,
    );
    const oldKeys = Object.keys({ ...source });

    chooseMessagesFromFiles(oldKeys, targets, filesReg)
        .then((chosenKeys) => {
            const result: localeMessageType = {};
            const resultMessages = _.uniq([...chosenKeys, ...persistedMessages]);
            resultMessages.forEach((key) => {
                result[key] = source[key];
            });
            const removedKeys = _.xor(resultMessages, oldKeys);
            if (removedKeys.length === 0) {
                cliLog.info('There is nothing to renew');
            } else {
                cliLog.info(`existing keys number: ${resultMessages.length}`);
                cliLog.info(`old keys number: ${oldKeys.length}`);
                cliLog.warningRed(`${removedKeys.length} keys have been removed:`);
                cliLog.warning(` - ${removedKeys.join('\n - ')}`);
            }
            return writeInFile(output, result);
        })
        .then(() => {
            cliLog.success('Success!');
        })
        .catch((err) => {
            cliLog.error(err);
        });
};
