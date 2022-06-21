/* eslint-disable no-console */
import { program } from 'commander';
import axios from 'axios';
import { DeclarativeConverter, StringRuleList } from '@adguard/tsurlfilter';
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import { cliLog } from '../cli-log';
import { ADGUARD_FILTERS_IDS } from '../bundle/constants';

const COMMON_FILTERS_DIR = 'src/filters';
const FILTERS_DIR = `${COMMON_FILTERS_DIR}/%browser`;
const DECLARATIVE_FILTERS_DIR = `${COMMON_FILTERS_DIR}/%browser%/declarative`;

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

const startConvert = (browser: string) => {
    const converter = new DeclarativeConverter();
    const filtersDir = FILTERS_DIR.replace('%browser', browser);
    const declarativeFiltersDir = `${DECLARATIVE_FILTERS_DIR.replace('%browser%', browser)}`;

    fs.readdirSync(filtersDir).forEach((file) => {
        const rulesetIndex = file.match(/\d+/);
        if (rulesetIndex) {
            const data = fs.readFileSync(`${filtersDir}/${file}`, { encoding: 'utf-8' });
            const list = new StringRuleList(
                +rulesetIndex, data, false,
            );
            const result = converter.convert(list, {
                resoursesPath: '/web-accessible-resources/redirects',
            });

            const fileDeclarative = file.replace('.txt', '.json');
            fse.ensureDirSync(declarativeFiltersDir);
            fs.writeFileSync(`${declarativeFiltersDir}/${fileDeclarative}`, JSON.stringify(result, null, '\t'));
        }
    });
};

const downloadFilter = async (url: UrlType, browser: BROWSERS) => {
    const filtersDir = FILTERS_DIR.replace('%browser', browser);

    fse.ensureDirSync(filtersDir);

    cliLog.info(`Download ${url.url}...`);

    const response = await axios.get(url.url, { responseType: 'arraybuffer' });

    fs.promises.writeFile(path.join(filtersDir, url.file), response.data);

    cliLog.info('Done');

    startConvert(browser);
};

const startDownload = async (browser: BROWSERS) => {
    const urls = getUrlsOfFiltersResources(browser);

    for (let i = 0; i < urls.length; i += 1) {
        const url = urls[i];
        // eslint-disable-next-line no-await-in-loop
        await downloadFilter(url, browser);
    }
};

const update = () => {
    try {
        startDownload(BROWSERS.CHROME);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

const сonvert = () => {
    try {
        startConvert(BROWSERS.CHROME);
    } catch (e) {
        console.error(e);
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
        .action(сonvert);

    program.parse();
};
