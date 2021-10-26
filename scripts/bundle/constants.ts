export const BROWSERS = {
    CHROME: 'chrome',
    EDGE: 'edge',
} as const;

export const BUILD_ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
} as const;

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
