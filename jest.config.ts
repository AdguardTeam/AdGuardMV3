/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
export default {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
    moduleNameMapper: {
        'Common/(.*)': ['<rootDir>/src/common/$1'],
        'Options/(.*)': ['<rootDir>/src/options/$1'],
    },
};
