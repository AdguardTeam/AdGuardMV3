import { RuleConverter } from '@adguard/tsurlfilter';
import FiltersDownloader, { DefinedExpressions } from '@adguard/filters-downloader/browser';

import { browserUtils } from 'Common/utils/browser-utils';
import { Rules } from 'Common/constants/common';

const FILTER_COMPILER_OPTIONS: DefinedExpressions = {
    adguard: true,
    adguard_ext_chromium: browserUtils.isChromium(),
    adguard_ext_firefox: browserUtils.isFirefoxBrowser(),
    adguard_ext_edge: browserUtils.isEdgeBrowser(),
    adguard_ext_safari: false,
    adguard_ext_opera: browserUtils.isOperaBrowser(),
};

export const COMMON_FILTERS_DIR = 'filters';

class Backend {
    loadingUrls: { [key: string]: boolean } = {};

    downloadFilterRules = async (filterId: number): Promise<Rules> => {
        const url = chrome.runtime.getURL(`${COMMON_FILTERS_DIR}/filter_${filterId}.txt`);

        const response = await FiltersDownloader.download(
            url, FILTER_COMPILER_OPTIONS,
        );

        // TODO: Why not convert on build and save converted result?
        const convertedRules = RuleConverter.convertRules(response.join('\n'));

        return {
            id: filterId,
            rules: convertedRules,
        };
    };

    loadFilterByUrl = async (url: string): Promise<string[]> => {
        if (url in this.loadingUrls) {
            return [];
        }

        this.loadingUrls[url] = true;

        try {
            const lines = await FiltersDownloader.download(url, FILTER_COMPILER_OPTIONS);
            delete this.loadingUrls[url];

            if (lines[0].indexOf('[') === 0) {
                // [Adblock Plus 2.0]
                lines.shift();
            }

            return lines;
        } catch (e: any) {
            delete this.loadingUrls[url];
            const message = e instanceof Error ? e.message : e;
            throw new Error(message);
        }
    };
}

export const backend = new Backend();
