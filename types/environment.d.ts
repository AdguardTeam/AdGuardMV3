import { Browser, BuildEnv } from '../webpack.config';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BUILD_ENV: BuildEnv,
            BROWSER: Browser,
        }
    }
}

export {};
