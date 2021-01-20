import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ZipWebpackPlugin from 'zip-webpack-plugin';
import { WebpackPluginInstance } from 'webpack';

const packageJson = require('./package.json');

const BUILD_ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
} as const;

export type BuildEnv = typeof BUILD_ENVS[keyof typeof BUILD_ENVS];

const BROWSERS = {
    CHROME: 'chrome',
    EDGE: 'edge',
} as const;

export type Browser = typeof BROWSERS[keyof typeof BROWSERS];

const updateManifest = (isDev: boolean, content: Buffer) => {
    const manifest = JSON.parse(content.toString());

    manifest.version = packageJson.version;

    if (isDev) {
        // TODO add eval rule e.g. 'unsafe-eval' when manifest v3 docs are released
        manifest.content_security_policy = { extension_pages: "script-src 'self'; object-src 'self'" };
    }

    return JSON.stringify(manifest, null, 4);
};

const capitalize = (str: string) => str.charAt(0)
    .toUpperCase() + str.slice(1);

const updateLocalesMSGName = (content: Buffer, buildEnv: BuildEnv) => {
    const messages = JSON.parse(content.toString());
    const IS_RELEASE = buildEnv === BUILD_ENVS.RELEASE;

    if (!IS_RELEASE) {
        messages.name.message += ` (${capitalize(buildEnv)})`;
    }

    return JSON.stringify(messages, null, 4);
};

const {
    BUILD_ENV = BUILD_ENVS.DEV,
    BROWSER = BROWSERS.CHROME,
}: { BUILD_ENV: BuildEnv, BROWSER: Browser } = process.env;

const IS_DEV = BUILD_ENV === BUILD_ENVS.DEV;

const BUILD_PATH = './build';
const SRC_PATH = './src';
const OUTPUT_PATH = BUILD_ENV;
const BACKGROUND_PATH = path.resolve(__dirname, SRC_PATH, 'background');
const POPUP_PATH = path.resolve(__dirname, SRC_PATH, 'popup');
const OPTIONS_PATH = path.resolve(__dirname, SRC_PATH, 'options');
const CONTENT_SCRIPTS_PATH = path.resolve(__dirname, SRC_PATH, 'content-scripts');

const plugins: WebpackPluginInstance[] = [
    new CopyWebpackPlugin({
        patterns: [
            {
                from: 'manifest.common.json',
                to: 'manifest.json',
                transform: (content) => updateManifest(IS_DEV, content),
            },
            {
                context: SRC_PATH,
                from: 'assets',
                to: 'assets',
            },
            {
                context: SRC_PATH,
                from: '_locales',
                to: '_locales',
                transform: (content) => updateLocalesMSGName(content, BUILD_ENV),
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
    new MiniCssExtractPlugin(),
];

if (IS_DEV) {
    plugins.push(
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['!**/*.json', '!assets/**/*'],
        }),
    );
} else {
    plugins.push(
        new ZipWebpackPlugin({
            path: '../',
            filename: `${BROWSER}-${packageJson.version}-${BUILD_ENV}.zip`,
        }),
    );
}

const config = {
    mode: IS_DEV ? 'development' : 'production',
    /* TODO: use 'eval-cheap-module-source-map' for DEV
        when 'content_security_policy' v3 docs is released and eval is accessible */
    devtool: false,
    entry: {
        background: BACKGROUND_PATH,
        popup: POPUP_PATH,
        'content-scripts': CONTENT_SCRIPTS_PATH,
        options: OPTIONS_PATH,
    },
    output: {
        path: path.resolve(__dirname, BUILD_PATH, OUTPUT_PATH, BROWSER),
        filename: '[name].js',
        publicPath: '',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
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
                        compact: false,
                    },
                },
            },
            {
                test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
                type: 'asset/resource',
            },
            {
                test: /\.p?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins,
};

module.exports = config;
