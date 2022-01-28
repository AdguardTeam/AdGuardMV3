/* eslint-disable no-console,no-restricted-syntax,no-await-in-loop */
import { program } from 'commander';

import { bundleRunner } from './bundle-runner';
import { getWebpackConfig } from './webpack-config';
import { BROWSERS, BUILD_ENVS } from './constants';

interface Task {
    (options: TaskOptions): Promise<void> | void
}

interface TaskOptions {
    watch?: boolean
}

export const bundle = () => {
    const bundleChrome: Task = (options: TaskOptions) => {
        const webpackConfig = getWebpackConfig(BROWSERS.CHROME);
        return bundleRunner(webpackConfig, options.watch);
    };

    const bundleEdge: Task = (options: TaskOptions) => {
        const webpackConfig = getWebpackConfig(BROWSERS.EDGE);
        return bundleRunner(webpackConfig, options.watch);
    };

    const devPlan = [
        bundleChrome,
        bundleEdge,
    ];

    const betaPlan = [
        bundleChrome,
        bundleEdge,
    ];

    const releasePlan = [
        bundleChrome,
        bundleEdge,
    ];

    const runBuild = async (tasks: Task[], watch: boolean) => {
        for (const task of tasks) {
            await task({ watch });
        }
    };

    const mainBuild = async (watch: boolean) => {
        switch (process.env.BUILD_ENV) {
            case BUILD_ENVS.DEV: {
                await runBuild(devPlan, watch);
                break;
            }
            case BUILD_ENVS.BETA: {
                await runBuild(betaPlan, watch);
                break;
            }
            case BUILD_ENVS.RELEASE: {
                await runBuild(releasePlan, watch);
                break;
            }
            default:
                throw new Error('Provide BUILD_ENV to choose correct build plan');
        }
    };

    const main = async (watch: boolean) => {
        try {
            await mainBuild(watch);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    };

    const chrome = async (watch: boolean) => {
        try {
            await bundleChrome({ watch });
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    };

    const edge = async (watch: boolean) => {
        try {
            await bundleEdge({ watch });
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    };

    program
        .option('--watch', 'Builds in watch mode', false);

    program
        .command('chrome')
        .description('Builds extension for chrome browser')
        .action(() => {
            chrome(program.opts().watch);
        });

    program
        .command('edge')
        .description('Builds extension for edge browser')
        .action(() => {
            edge(program.opts().watch);
        });

    program
        .description('By default builds for all platforms')
        .action(() => {
            main(program.opts().watch);
        });

    program.parse(process.argv);
};
