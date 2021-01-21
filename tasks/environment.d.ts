import { BROWSERS, BUILD_ENVS } from './constants';

export type BuildEnv = typeof BUILD_ENVS[keyof typeof BUILD_ENVS];
export type Browser = typeof BROWSERS[keyof typeof BROWSERS];

declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            BUILD_ENV: BuildEnv,
            BROWSER: Browser,
        }
    }
}
