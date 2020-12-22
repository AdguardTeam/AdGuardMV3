const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
    plugins: [
        autoprefixer,
        cssnano({ presets: 'default' }),
        'postcss-import',
        'postcss-nested',
        'postcss-svg',
        'postcss-preset-env',
    ],
};
