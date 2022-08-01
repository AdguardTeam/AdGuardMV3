import path from 'path';
import fs from 'fs';

import { Compiler, Compilation, sources } from 'webpack';
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

    // Path to the location where the timestamp file of the filters will be saved
    private outputFiltersPath: string;

    // Extension of original filters
    private FILTERS_EXT = '.txt';

    // Prefix of filter's filename to extract filter id
    private FILTER_PREFIX = 'filter_';

    /**
     * @param originalFiltersPath absolute path to folder with original filters
     * @param outputFiltersPath path to the location where the timestamp file of the filters will be saved
    */
    constructor(originalFiltersPath: string, outputFiltersPath: string) {
        this.filtersVersions = new Map<number, number>();
        this.originalFiltersPath = originalFiltersPath;
        this.outputFiltersPath = outputFiltersPath;
    }

    apply = async (compiler: Compiler) => {
        const pluginName = this.constructor.name;

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tapAsync({
                name: pluginName,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
            }, async (assets, callback) => {
                await this.collectFiltersVersions(this.originalFiltersPath);
                console.log('filters versions: ');
                Array.from(this.filtersVersions).forEach(([id, version]) => {
                    console.log(`filter ${id} updated at ${new Date(version).toISOString()} (${version})`);
                });
                this.saveFiltersTimestamps(compilation);

                callback();
            });
        });
    };

    /**
     * Scans specified directory for original filters and saves theirs ids and version
     *
     * * @param filtersDir absolute path to folder with original filters
    */
    private collectFiltersVersions = async (filtersDir: string): Promise<void> => {
        if (!fs.existsSync(filtersDir)) {
            return;
        }
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
    private saveFiltersTimestamps = (compilation: Compilation) => {
        const savePath = path.join(this.outputFiltersPath, FILTERS_VERSIONS_FILENAME);
        compilation.emitAsset(
            savePath,
            new sources.RawSource(JSON.stringify(Array.from(this.filtersVersions))),
        );
        console.log(`Filters timestamps added to assets: ${savePath}`);
    };
}
