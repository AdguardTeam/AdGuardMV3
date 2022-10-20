import FiltersDownloader, { DefinedExpressions } from '@adguard/filters-downloader/browser';

import { browserUtils } from 'Common/utils/browser-utils';

const FILTER_COMPILER_OPTIONS: DefinedExpressions = {
    adguard: true,
    adguard_ext_chromium: browserUtils.isChromium(),
    adguard_ext_firefox: browserUtils.isFirefoxBrowser(),
    adguard_ext_edge: browserUtils.isEdgeBrowser(),
    adguard_ext_safari: false,
    adguard_ext_opera: browserUtils.isOperaBrowser(),
};

class Backend {
    loadingUrls: { [key: string]: boolean } = {};

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
