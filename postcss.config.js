import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
    plugins: [
        [postcssPresetEnv, { stage: 3, features: { 'nesting-rules': true } }],
        autoprefixer,
        cssnano({ preset: 'default' }),
        'postcss-import',
        'postcss-nested',
        'postcss-svg',
        'postcss-preset-env',
    ],
};
