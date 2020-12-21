const presets = [
    [
        "@babel/env",
        {
            targets: {
                firefox: '50',
                chrome: '64',
            },
            corejs: "3",
            useBuiltIns: 'entry',
        },
    ]
];

module.exports = {presets}
