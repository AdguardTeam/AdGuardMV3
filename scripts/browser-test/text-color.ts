import chalk from 'chalk';

export const colorizeStatusText = (status: string) => {
    if (status === 'passed') {
        return chalk.green(status);
    }
    if (status === 'skipped') {
        // some tests may be skipped due to exceptions
        return chalk.yellow(status);
    }
    return chalk.red(status);
};

export const colorizeTitleText = (title: string) => chalk.bold.inverse(title);

export const colorizeDurationTime = (duration: number | string) => chalk.yellow(duration);
