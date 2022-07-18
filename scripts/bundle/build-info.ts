import path from 'path';

import fse from 'fs-extra';

import { BUILD_PATH } from '../build-constants';
import packageJson from '../../package.json';
import { getEnvConf } from '../helpers';

const config = getEnvConf(process.env.BUILD_ENV);
const OUTPUT_PATH = config.outputPath;

const content = `version=${packageJson.version}`;
const FILE_NAME = 'build.txt';

const filePath = path.join(BUILD_PATH, OUTPUT_PATH, FILE_NAME);

/**
 * Writes build.txt file with current version
 * @returns {Promise<void>}
 */
export const buildInfo = async () => {
    await fse.writeFile(filePath, content, 'utf-8');
};
