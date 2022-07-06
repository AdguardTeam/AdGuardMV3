/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
export default {
    verbose: true,
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
    setupFiles: ['./tests/__setups__/chrome.ts'],
    moduleNameMapper: {
        'Common/(.*)': ['<rootDir>/src/common/$1'],
        'Options/(.*)': ['<rootDir>/src/options/$1'],
        // eslint-disable-next-line max-len
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/__mocks__/fileMock.ts',
        '\\.(css|less|pcss)$': '<rootDir>/tests/__mocks__/styleMock.ts',
    },
};
