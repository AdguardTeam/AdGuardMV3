import path from 'path';

import { Compiler } from 'webpack';
import fse from 'fs-extra';

import FiltersUtils from '../../src/common/utils/filters';
import { FILTERS_VERSIONS_FILENAME } from '../../src/common/constants/common';

import { readNLinesFromFileWithStream } from './read-from-stream';

/**
 * Webpack plugin, collect filters versions and save it to filters folder
 */
export default class CollectFiltersVersionsPlugin {
    // Stores versions of filters
    private filtersVersions: Map<number, number>;

    // Path to original .txt filters
    private originalFiltersPath: string;

    // Path to build folder with .txt filters
    private outputFiltersPath: string;

    // Extension of original filters
    private FILTERS_EXT = '.txt';

    // Prefix of filter's filename to extract filter id
    private FILTER_PREFIX = 'filter_';

    /**
     * @param originalFiltersPath absolute path to folder with original filters
     * @param outputFiltersPath absolute path to output build folder with original filters
    */
    constructor(originalFiltersPath: string, outputFiltersPath: string) {
        this.filtersVersions = new Map<number, number>();
        this.originalFiltersPath = originalFiltersPath;
        this.outputFiltersPath = outputFiltersPath;
    }

    apply = async (compiler: Compiler) => {
        // First scan
        await this.collectFiltersVersions(this.originalFiltersPath);
        await this.saveFiltersFilters();

        // Watch for changes
        compiler.hooks.watchRun.tap('WatchRun', async (comp) => {
            const promises = Array.from(comp.modifiedFiles)
                .filter((p) => p.includes(this.originalFiltersPath) && p.endsWith(this.FILTERS_EXT))
                .map((p) => this.saveTimestampForFilter(p));

            await Promise.all(promises);

            if (promises.length > 0) {
                await this.saveFiltersFilters();
            }
        });
    };

    /**
     * Scans specified directory for original filters and saves theirs ids and version
     *
     * * @param filtersDir absolute path to folder with original filters
    */
    private collectFiltersVersions = async (filtersDir: string): Promise<void> => {
        const promises = fse.readdirSync(filtersDir)
            .map((filePath): Promise<void> => {
                if (!filePath.endsWith(this.FILTERS_EXT)) {
                    return Promise.resolve();
                }

                return this.saveTimestampForFilter(path.resolve(this.originalFiltersPath, filePath));
            });

        await Promise.all(promises);
    };

    /**
     * Gets version (in milliseconds) for specified filter
     *
     * @param absolutePath absolute path to original filter
     */
    private getTimeStampForFilter = async (absolutePath: string): Promise<number> => {
        const filterInfoStings = await readNLinesFromFileWithStream(
            absolutePath,
            FiltersUtils.FIRST_N_LINES,
        );
        const timestamp = FiltersUtils.getTimestampForFilter(filterInfoStings);

        return new Date(timestamp).getTime();
    };

    /**
     * Extracts filter version and saves it to private map
     *
     * @param absoluteFilePath absolute path to original filter
     * */
    private saveTimestampForFilter = async (absoluteFilePath: string): Promise<void> => {
        const version = await this.getTimeStampForFilter(absoluteFilePath);
        const baseFileName = path.basename(absoluteFilePath, this.FILTERS_EXT);
        const id = Number.parseInt(baseFileName.replace(this.FILTER_PREFIX, ''), 10);
        this.filtersVersions.set(id, version);
    };

    /**
     * Saves json-stringified array-version of Map with filters' ids and versions
     * to output build folder with original filters
     */
    private saveFiltersFilters = async () => {
        fse.ensureDirSync(this.outputFiltersPath);
        fse.writeFileSync(
            path.resolve(this.outputFiltersPath, FILTERS_VERSIONS_FILENAME),
            JSON.stringify(Array.from(this.filtersVersions)),
        );
    };
}
