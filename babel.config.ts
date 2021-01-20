export default (api: any) => {
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
    };
};
