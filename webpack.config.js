const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');

const BUILD_ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
};

const { BUILD_ENV } = process.env;
const BROWSER = 'chrome';

const IS_DEV = BUILD_ENV === BUILD_ENVS.DEV;

const BUILD_PATH = './build';
const SRC_PATH = './src';
const OUTPUT_PATH = BUILD_ENV;
const BACKGROUND_PATH = path.resolve(__dirname, SRC_PATH, 'background');
const POPUP_PATH = path.resolve(__dirname, SRC_PATH, 'popup');
const OPTIONS_PATH = path.resolve(__dirname, SRC_PATH, 'options');
const CONTENT_SCRIPTS_PATH = path.resolve(__dirname, SRC_PATH, 'content-scripts');

const plugins = [
    new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'manifest.common.json',
                    to: 'manifest.json',
                },
                {
                    context: SRC_PATH,
                    from: 'assets',
                    to: 'assets',
                },
                {
                    /* TODO update locales in browser on change ?*/
                    context: SRC_PATH,
                    from: '_locales',
                    to: '_locales',
                },
            ],
        },
    ),
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
    plugins.push(new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['!**/*.json', '!assets/**/*']
    }))
} else {
    plugins.push(new ZipWebpackPlugin({
        path: '../',
        filename: `${BROWSER}.zip`,
    }));
}

const config = {
    mode: IS_DEV ? 'development' : 'production',
    /* FIXME - find out manifest v3 eval policy for different scripts */
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
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {babelrc: true, compact: false},
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
