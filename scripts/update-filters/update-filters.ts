import axios from 'axios';
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import * as TSUrlFilter from '@adguard/tsurlfilter';
import { cliLog } from '../cli-log';

const COMMON_FILTERS_DIR = 'src/filters';
const FILTERS_DIR = `${COMMON_FILTERS_DIR}/%browser`;
const DECLARATIVE_FILTERS_DIR = `${COMMON_FILTERS_DIR}/%browser%/declarative`;

const ADGUARD_FILTERS_IDS = [1, 2, 3, 4];

const EXTENSION_FILTERS_SERVER_URL_FORMAT = 'https://filters.adtidy.org/extension/%browser';
const FILTER_DOWNLOAD_URL_FORMAT = `${EXTENSION_FILTERS_SERVER_URL_FORMAT}/filters/%filter.txt`;

enum BROWSERS {
    CHROME = 'chrome',
    EDGE = 'edge',
}

export type UrlType = {
    id: number,
    url: string,
    file: string,
};

const getUrlsOfFiltersResources = (browser: string) => {
    const filters = [];

    const currentBrowser = browser === BROWSERS.CHROME ? 'chromium' : browser;

    // eslint-disable-next-line no-restricted-syntax
    for (const filterId of ADGUARD_FILTERS_IDS) {
        filters.push({
            id: filterId,
            url: FILTER_DOWNLOAD_URL_FORMAT.replace('%browser', currentBrowser).replace('%filter', `${filterId}`),
            file: `filter_${filterId}.txt`,
        });
    }

    return filters;
};

const convertFilters = (url: UrlType, browser: string) => {
    const { file, id } = url;
    // TODO implement plain converter before declarative
    const converter = new TSUrlFilter.DeclarativeConverter();
    const filtersDir = FILTERS_DIR.replace('%browser', browser);
    const declarativeFiltersDir = `${DECLARATIVE_FILTERS_DIR.replace('%browser%', browser)}`;

    const data = fs.readFileSync(`${filtersDir}/${file}`, { encoding: 'utf-8' });

    const list = new TSUrlFilter.StringRuleList(ADGUARD_FILTERS_IDS[id], data, false);

    const result = converter.convert(list);

    const fileDeclarative = file.replace('.txt', '.json');
    fse.ensureDirSync(declarativeFiltersDir);
    fs.writeFileSync(`${declarativeFiltersDir}/${fileDeclarative}`, JSON.stringify(result, null, '\t'));
};

const downloadFilter = async (url: UrlType, browser: string) => {
    const filtersDir = FILTERS_DIR.replace('%browser', browser);

    fse.ensureDirSync(filtersDir);

    cliLog.info(`Download ${url.url}...`);

    const response = await axios.get(url.url, { responseType: 'arraybuffer' });

    await fs.promises.writeFile(path.join(filtersDir, url.file), response.data);
    convertFilters(url, browser);

    cliLog.info('Done');
};

const startDownload = async (browser: string) => {
    const urls = getUrlsOfFiltersResources(browser);

    for (let i = 0; i < urls.length; i += 1) {
        const url = urls[i];
        // eslint-disable-next-line no-await-in-loop
        await downloadFilter(url, browser);
    }
};

export const updateFilters = () => {
    startDownload(BROWSERS.CHROME);
};
