import path from 'path';

import fse from 'fs-extra';
import axios from 'axios';

import {
    PROJECT_ID,
    BASE_LOCALE,
    LOCALE_PAIRS,
    API_URL,
    LOCALES_RELATIVE_PATH,
    FORMAT,
    LOCALE_DATA_FILENAME,
} from './locales-constants';

const LOCALES_UPLOAD_URL = `${API_URL}/upload`;
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);

// eslint-disable-next-line import/no-extraneous-dependencies
const FormData = require('form-data');

type preparedDataType = { headers: { [key: string]: string }, formData: FormData, url: string };

const prepare = (locale: string): preparedDataType => {
    const formData = new FormData();
    // Use 'chrome' format type for Browser Extensions
    // https://support.crowdin.com/file-formats/chrome-json/
    // https://support.crowdin.com/advanced-project-setup/#export
    formData.append('format', FORMAT);
    formData.append('language', LOCALE_PAIRS[locale] || locale);
    formData.append('filename', LOCALE_DATA_FILENAME);
    formData.append('project', PROJECT_ID);
    formData.append('file', fse.createReadStream(path.join(LOCALES_DIR, `${locale}/${LOCALE_DATA_FILENAME}`)));
    const headers: { [key: string]: string } = {
        ...formData.getHeaders(),
    };
    return { formData, url: LOCALES_UPLOAD_URL, headers };
};

const uploadLocale = async (locale: string) => {
    const { url, formData, headers } = prepare(locale);
    const response = await axios.post<FormData>(url, formData, { headers });
    return response.data;
};

export const uploadLocales = async () => {
    return uploadLocale(BASE_LOCALE);
};
