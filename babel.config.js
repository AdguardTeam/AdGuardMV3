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
        ],
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: false }],
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
        ],
    };
};
