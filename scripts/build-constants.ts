import path from 'path';

export const BUILD_PATH = path.resolve(__dirname, '../build');

export const ENVS = {
    DEV: 'dev',
    RELEASE: 'release',
};

export const ENV_CONF = {
    [ENVS.DEV]: { outputPath: 'dev', mode: 'development' },
    [ENVS.RELEASE]: { outputPath: 'release', mode: 'production' },
};

export const BROWSERS = {
    CHROME: 'chrome',
    EDGE: 'edge',
} as const;

export const BUILD_ENVS = {
    DEV: 'dev',
    RELEASE: 'release',
} as const;

export const GLOBAL_WORKER_ENVS = {
    ENABLE: 'true',
} as const;

export type BuildEnv = typeof BUILD_ENVS[keyof typeof BUILD_ENVS];
export type GlobalWorkerEnv = typeof GLOBAL_WORKER_ENVS[keyof typeof GLOBAL_WORKER_ENVS];
export type Browser = typeof BROWSERS[keyof typeof BROWSERS];

declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            BUILD_ENV: BuildEnv,
            GLOBAL_WORKER: GlobalWorkerEnv | undefined,
            BROWSER: Browser,
        }
    }
}
