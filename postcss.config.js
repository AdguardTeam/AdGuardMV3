import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    plugins: [
        'postcss-nested', // should go before postcssPresetEnv with nesting-rules enabled
        [postcssPresetEnv, { stage: 3, features: { 'nesting-rules': true } }],
        autoprefixer,
        cssnano({ preset: 'default' }),
        'postcss-import',
        'postcss-svg',
    ],
};
