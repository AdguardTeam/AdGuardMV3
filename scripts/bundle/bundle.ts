import { program } from 'commander';
import { copyWar } from '@adguard/tswebextension/cli';

import { BROWSERS, BUILD_ENVS } from '../build-constants';
import { cliLog } from '../cli-log';

import { buildInfo } from './build-info';
import { bundleRunner } from './bundle-runner';
import { getWebpackConfig } from './webpack-config';

type Task = (options: TaskOptions) => Promise<void> | void;

interface TaskOptions {
    watch?: boolean
}

export const bundle = () => {
    const copyExternal: Task = () => {
        return copyWar('src/web-accessible-resources');
    };

    const bundleChrome: Task = (options: TaskOptions) => {
        const webpackConfig = getWebpackConfig(BROWSERS.CHROME, options.watch);
        return bundleRunner(webpackConfig, options.watch);
    };

    const bundleEdge: Task = (options: TaskOptions) => {
        const webpackConfig = getWebpackConfig(BROWSERS.EDGE, options.watch);
        return bundleRunner(webpackConfig, options.watch);
    };

    const devPlan = [
        copyExternal,
        bundleChrome,
        bundleEdge,
        buildInfo,
    ];

    const releasePlan = [
        copyExternal,
        bundleChrome,
        bundleEdge,
        buildInfo,
    ];

    const runBuild = async (tasks: Task[], watch: boolean) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const task of tasks) {
            // eslint-disable-next-line no-await-in-loop
            await task({ watch });
        }
    };

    const mainBuild = async (watch: boolean) => {
        switch (process.env.BUILD_ENV) {
            case BUILD_ENVS.DEV: {
                await runBuild(devPlan, watch);
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
            cliLog.error(JSON.stringify(e));
            process.exit(1);
        }
    };

    const chrome = async (watch: boolean) => {
        try {
            await bundleChrome({ watch });
        } catch (e) {
            cliLog.error(JSON.stringify(e));
            process.exit(1);
        }
    };

    const edge = async (watch: boolean) => {
        try {
            await bundleEdge({ watch });
        } catch (e) {
            cliLog.error(JSON.stringify(e));
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
