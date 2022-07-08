import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ZipWebpackPlugin from 'zip-webpack-plugin';
import { Configuration, WebpackPluginInstance } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import _ from 'lodash';
import fse from 'fs-extra';

import { FILTER_RULESET, RulesetType } from '../../src/common/constants/filters';
import type { Browser, BuildEnv } from '../build-constants';
import { BROWSERS, BUILD_ENVS, RULESET_NAME } from '../build-constants';

const packageJson = require('../../package.json');
const tsconfig = require('../../tsconfig.json');

const APP_DIR = path.resolve(__dirname, '../../src');
const DECLARATIVE_FILTERS_DIR = `${APP_DIR}/filters/%browser%/declarative`;

const updateManifest = (isDev: boolean, content: Buffer, browser: string) => {
    const manifest = JSON.parse(content.toString());

    manifest.version = packageJson.version;

    if (isDev) {
        // TODO add eval rule e.g. 'unsafe-eval' when manifest v3 docs are released
        manifest.content_security_policy = { extension_pages: "script-src 'self'; object-src 'self'" };
    }

    const declarativeFiltersDir = `${DECLARATIVE_FILTERS_DIR.replace('%browser%', browser)}`;

    if (fse.existsSync(declarativeFiltersDir)) {
        const nameList = fse.readdirSync(declarativeFiltersDir)
            .filter((filePath) => filePath && !filePath.endsWith('.map'));

        const rules = {
            rule_resources: nameList.map((name: string) => {
                const rulesetIndex = Number.parseInt(name.match(/\d+/)![0], 10);
                const id = `${RULESET_NAME}${rulesetIndex}` as RulesetType;
                const { enabled } = FILTER_RULESET[id];
                return {
                    id,
                    enabled,
                    path: `filters/declarative/${name}`,
                };
            }),
        };

        manifest.declarative_net_request = rules;
    }

    return JSON.stringify(manifest, null, 4);
};

const updateLocalesMSGName = (content: Buffer, buildEnv: BuildEnv) => {
    const messages = JSON.parse(content.toString());
    const IS_RELEASE = buildEnv === BUILD_ENVS.RELEASE;

    if (!IS_RELEASE) {
        messages.name.message += ` (${_.capitalize(buildEnv)})`;
    }

    return JSON.stringify(messages, null, 4);
};

export const getWebpackConfig = (browser: Browser = BROWSERS.CHROME): Configuration => {
    const buildEnv = process.env.BUILD_ENV;

    const IS_DEV = buildEnv === BUILD_ENVS.DEV;

    const BUILD_PATH = '../../build';
    const SRC_PATH = '../../src';
    const OUTPUT_PATH = buildEnv;
    const BACKGROUND_PATH = path.resolve(__dirname, SRC_PATH, 'background');
    const POPUP_PATH = path.resolve(__dirname, SRC_PATH, 'popup');
    const OPTIONS_PATH = path.resolve(__dirname, SRC_PATH, 'options');
    const DEVTOOLS_PATH = path.resolve(__dirname, SRC_PATH, 'devtools');
    const DEBUGGING_PATH = path.resolve(__dirname, SRC_PATH, 'debugging');
    const CONTENT_SCRIPTS_PATH = path.resolve(__dirname, SRC_PATH, 'content-scripts');
    const ASSISTANT_PATH = path.resolve(CONTENT_SCRIPTS_PATH, 'assistant');

    const plugins: WebpackPluginInstance[] = [
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'manifest.common.json',
                    to: 'manifest.json',
                    transform: (content) => updateManifest(IS_DEV, content, browser),
                },
                {
                    context: 'src',
                    from: 'assets',
                    to: 'assets',
                },
                {
                    context: 'src',
                    from: `filters/${browser}`,
                    to: 'filters',
                    noErrorOnMissing: true,
                },
                {
                    context: 'src',
                    from: '_locales',
                    to: '_locales',
                    transform: (content) => updateLocalesMSGName(content, buildEnv),
                },
                {
                    context: 'src',
                    from: 'web-accessible-resources',
                    to: 'web-accessible-resources',
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.join(POPUP_PATH, 'index.html'),
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(OPTIONS_PATH, 'index.html'),
            filename: 'options.html',
            chunks: ['options'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(DEVTOOLS_PATH, 'index.html'),
            filename: 'devtools.html',
            chunks: ['devtools'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(DEBUGGING_PATH, 'index.html'),
            filename: 'debugging.html',
            chunks: ['debugging'],
        }),
        new ZipWebpackPlugin({
            path: '../',
            filename: `${browser}.zip`,
        }),
        new MiniCssExtractPlugin(),
    ];

    if (IS_DEV) {
        plugins.push(
            new CleanWebpackPlugin({
                cleanAfterEveryBuildPatterns: ['!**/*.json', '!assets/**/*'],
            }),
        );
    }

    return {
        mode: IS_DEV ? 'development' : 'production',
        /* TODO: use 'eval-cheap-module-source-map' for DEV
            when 'content_security_policy' v3 docs is released and eval is accessible */
        devtool: false,
        optimization: {
            minimize: false,
        },
        entry: {
            background: BACKGROUND_PATH,
            popup: POPUP_PATH,
            debugging: DEBUGGING_PATH,
            options: OPTIONS_PATH,
            devtools: DEVTOOLS_PATH,
            // content-scripts
            'content-scripts': CONTENT_SCRIPTS_PATH,
            assistant: ASSISTANT_PATH,
        },
        output: {
            path: path.resolve(__dirname, BUILD_PATH, OUTPUT_PATH, browser),
            filename: '[name].js',
            publicPath: '',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: Object.keys(tsconfig.compilerOptions.paths)
                // Reduce to load aliases from ./tsconfig.json in appropriate for webpack form
                .reduce((aliases: { [key: string]: string }, key) => {
                    const paths = tsconfig.compilerOptions.paths[key].map((p: string) => p.replace('/*', ''));
                    // eslint-disable-next-line no-param-reassign
                    aliases[key.replace('/*', '')] = path.resolve(
                        __dirname,
                        '../../',
                        tsconfig.compilerOptions.baseUrl,
                        ...paths,
                    );
                    return aliases;
                }, {}),
            fallback: {
                url: false,
                path: false,
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: true,
                        },
                    },
                },
                {
                    test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
                    type: 'asset/resource',
                },
                {
                    test: /\.p?css$/,
                    include: APP_DIR,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    compileType: 'module',
                                    mode: 'local',
                                    auto: true,
                                    exportGlobals: false,
                                    localIdentName: IS_DEV ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64]',
                                    exportLocalsConvention: 'camelCaseOnly',
                                    exportOnlyLocals: false,
                                },
                            },
                        },
                        'postcss-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
        plugins,
    };
};
