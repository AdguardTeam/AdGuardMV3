const tsconfig = require('../tsconfig.json');

const pathGroups = Object.keys(tsconfig.compilerOptions.paths).map((alias) => {
    return {
        // Symbols '**' needs for regexp pattern
        // E.x.: "common/*" (tsconfig regexp) -> "common/**" (eslint-order regexp), "common/" -> "common/"
        // See https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#pathgroups-array-of-objects
        pattern: alias.includes('*') ? `${alias}*` : alias,
        group: 'internal',
    };
});

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    extends: [
        'airbnb-typescript',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    globals: {
        chrome: 'readonly',
    },
    settings: {
        react: {
            pragma: 'React',
            version: 'detect',
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true
            }
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
    plugins: [
        'import',
        'import-newlines',
    ],
    rules: {
        'arrow-body-style': 'off',
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'import/prefer-default-export': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: [
                    'enumMember',
                ],
                format: ['PascalCase', 'UPPER_CASE'],
            },
        ],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/*.config.ts',
                    '**/*.config.js',
                    'scripts/**',
                    'tests/**',
                ],
            },
        ],
        'max-len': ['error', 120],
        'import-newlines/enforce': ['error', 3, 120],
        'import/order': [
            'error',
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "index",
                ],
                pathGroups,
                'newlines-between': 'always',
                warnOnUnassignedImports: false,
            },
        ],
    },
};
