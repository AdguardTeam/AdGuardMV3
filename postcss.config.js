import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

module.exports = {
    plugins: [
        autoprefixer,
        cssnano({ preset: 'default' }),
        'postcss-import',
        'postcss-nested',
        'postcss-svg',
        'postcss-preset-env',
    ],
};
