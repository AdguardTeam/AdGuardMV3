import path from 'path';

import { program } from 'commander';
import axios from 'axios';
import { convertFilters } from '@adguard/tsurlfilter/cli';
import fse from 'fs-extra';

import { ADGUARD_FILTERS_IDS } from '../../src/common/constants/filters';
import { FILTERS_I18N_FILENAME, WEB_ACCESSIBLE_RESOURCES_PATH } from '../../src/common/constants/common';
import { cliLog } from '../cli-log';

const COMMON_FILTERS_DIR = 'src/filters';
const FILTERS_DIR = `${COMMON_FILTERS_DIR}/%browser`;
const DECLARATIVE_FILTERS_DIR = `${COMMON_FILTERS_DIR}/%browser%/declarative`;

const EXTENSION_FILTERS_SERVER_URL_FORMAT = 'https://filters.adtidy.org/extension/%browser';
const FILTER_DOWNLOAD_URL_FORMAT = `${EXTENSION_FILTERS_SERVER_URL_FORMAT}/filters/%filter.txt`;

enum BROWSERS {
    CHROME = 'chrome',
    EDGE = 'edge',
}

const BROWSER_PATH_PART: Record<BROWSERS, string> = {
    [BROWSERS.CHROME]: 'chromium',
    [BROWSERS.EDGE]: 'edge',
};

export type UrlType = {
    id: number,
    url: string,
    file: string,
};

const getUrlsOfFiltersResources = (browser: string) => {
    const currentBrowser = browser === BROWSERS.CHROME ? 'chromium' : browser;

    return ADGUARD_FILTERS_IDS.map(({ id }) => ({
        id,
        url: FILTER_DOWNLOAD_URL_FORMAT.replace('%browser', currentBrowser).replace('%filter', `${id}`),
        file: `filter_${id}.txt`,
    }));
};

const startConvert = async (browser: string) => {
    const filtersDir = FILTERS_DIR.replace('%browser', browser);
    const declarativeFiltersDir = `${DECLARATIVE_FILTERS_DIR.replace('%browser%', browser)}`;
    await convertFilters(
        filtersDir,
        WEB_ACCESSIBLE_RESOURCES_PATH,
        declarativeFiltersDir,
        false,
    );
};

const downloadFilter = async (url: UrlType, filtersDir: string) => {
    cliLog.info(`Download ${url.url}...`);

    const response = await axios.get(url.url, { responseType: 'arraybuffer' });

    await fse.writeFile(path.join(filtersDir, url.file), response.data);

    cliLog.info(`Download ${url.url} done`);
};

const downloadTranslations = async (browser: BROWSERS, filtersDir: string) => {
    cliLog.info('Download i18n...');

    const url = `https://filters.adtidy.org/extension/${BROWSER_PATH_PART[browser]}/filters_i18n.json`;
    const response = await axios.get(url, { responseType: 'json' });
    await fse.writeFile(
        path.join(filtersDir, FILTERS_I18N_FILENAME),
        JSON.stringify(response.data, null, '\t'),
    );

    cliLog.info('Download i18n done');
};

const startDownload = async (browser: BROWSERS) => {
    const filtersDir = FILTERS_DIR.replace('%browser', browser);
    fse.ensureDirSync(filtersDir);

    await downloadTranslations(browser, COMMON_FILTERS_DIR);

    const urls = getUrlsOfFiltersResources(browser);
    await Promise.all(urls.map((url) => downloadFilter(url, filtersDir)));
};

const update = async () => {
    try {
        await startDownload(BROWSERS.CHROME);
    } catch (e) {
        cliLog.error(JSON.stringify(e));
        process.exit(1);
    }
};

const convert = () => {
    try {
        startConvert(BROWSERS.CHROME);
    } catch (e) {
        cliLog.error(JSON.stringify(e));
        process.exit(1);
    }
};

export const filters = () => {
    program
        .command('update')
        .description('Download and convert filters into declarative rules')
        .action(update);

    program
        .command('convert')
        .description('Convert filters into declarative rules')
        .action(convert);

    program.parse();
};
