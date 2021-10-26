/* eslint-disable no-console */
import webpack, { Stats, Configuration } from 'webpack';

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
                console.error(err.stack || err);
                // @ts-ignore
                if (err.details) {
                    // @ts-ignore
                    console.error(err.details);
                }
                reject();
                return;
            }

            if (!stats) {
                resolve();
                return;
            }

            if (stats.hasErrors()) {
                console.log(stats.toString({
                    colors: true,
                    all: false,
                    errors: true,
                    moduleTrace: true,
                    logging: 'error',
                }));
                reject();
                return;
            }

            console.log(stats.toString({
                chunks: false, // Makes the build much quieter
                colors: true, // Shows colors in the console
            }));

            resolve();
        });
    });
};
