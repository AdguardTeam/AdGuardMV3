import chalk from 'chalk';

export const enum TestStatus {
    Passed = 'passed',
    Failed = 'failed',
    Skipped = 'skipped',
    Timeout = 'timeout',
}

export const colorizeStatusText = (status: TestStatus) => {
    if (status === TestStatus.Passed) {
        return chalk.green(status);
    }
    if (status === TestStatus.Skipped) {
        // some tests may be skipped due to exceptions
        return chalk.yellow(status);
    }
    return chalk.red(status);
};

export const colorizeTitleText = (title: string) => chalk.bold.inverse(title);

export const colorizeDurationTime = (duration: number | string) => chalk.yellow(duration);
