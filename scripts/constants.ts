import path from 'path';

export const BUILD_PATH = path.resolve(__dirname, '../build');

export const ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
};

export const ENV_CONF = {
    [ENVS.DEV]: { outputPath: 'dev', mode: 'development' },
    [ENVS.BETA]: { outputPath: 'beta', mode: 'production' },
    [ENVS.RELEASE]: { outputPath: 'release', mode: 'production' },
};
