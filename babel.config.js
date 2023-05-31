module.exports = (api) => {
    api.cache(false);
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        chrome: '88',
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
            ['@babel/plugin-proposal-private-methods', { loose: true }],
            ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
        ],
    };
};
