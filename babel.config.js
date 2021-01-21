module.exports = (api) => {
    api.cache(false);
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        chrome: '55',
                        edge: '79',
                        opera: '42',
                    },
                    corejs: '3',
                    useBuiltIns: 'entry',
                },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
    };
};
