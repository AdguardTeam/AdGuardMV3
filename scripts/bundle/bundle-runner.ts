import webpack, { Stats, Configuration } from 'webpack';

import { cliLog } from '../cli-log';

declare interface CallbackFunction<T> {
    (err?: Error, result?: T): any;
}

export const bundleRunner = (webpackConfig: Configuration, watch = false) => {
    const compiler = webpack(webpackConfig);

    const run = watch
        ? (cb: CallbackFunction<Stats>) => compiler.watch({}, cb)
        : (cb: CallbackFunction<Stats>) => compiler.run(cb);

    return new Promise<void>((resolve, reject) => {
        run((err, stats) => {
            if (err) {
                cliLog.error(err.stack || err.message || err.name);
                // @ts-ignore
                if (err.details) {
                    // @ts-ignore
                    cliLog.error(err.details);
                }
                reject();
                return;
            }

            if (!stats) {
                resolve();
                return;
            }

            if (stats.hasErrors()) {
                cliLog.info(stats.toString({
                    colors: true,
                    all: false,
                    errors: true,
                    moduleTrace: true,
                    logging: 'error',
                }));
                reject();
                return;
            }

            cliLog.info(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true, // Shows colors in the console
            }));

            resolve();
        });
    });
};
