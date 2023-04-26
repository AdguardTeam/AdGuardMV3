/* eslint-disable no-console */
import { colorizeDurationTime, colorizeStatusText, colorizeTitleText } from './text-color';

export interface LogDetails {
    name: string,
    tests: {
        name: string,
        status: string,
    }[],
    status: string,
    testCounts: {
        passed: number,
        failed: number,
        skipped: number,
        total: number
    },
    runtime: number
}

export const logTestResult = (details: LogDetails) => {
    const counts = details.testCounts;

    console.log(colorizeTitleText(details.name));

    console.log('Status:', colorizeStatusText(details.status));
    console.log('Total %d tests: %d passed, %d failed, %d skipped',
        counts.total,
        counts.passed,
        counts.failed,
        counts.skipped);
    // precision format log %.2f doesn't work in chrome
    console.log(`Duration: ${colorizeDurationTime(details.runtime.toFixed(2))}ms \n`);

    const { tests } = details;

    for (let i = 0; i < tests.length; i += 1) {
        const test = tests[i];

        console.log(test.name, colorizeStatusText(test.status));
    }

    console.log('\n');
};

export const logTestTimeout = (testName: string, timeoutMs: number) => {
    console.log(colorizeTitleText(testName));

    console.log('Status:', colorizeStatusText('TIMEOUT'));
    console.log(`After waited ${colorizeDurationTime(timeoutMs)}ms test was skipped\n`);

    console.log('\n');
};
