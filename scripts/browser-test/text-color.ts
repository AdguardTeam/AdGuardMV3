import chalk from 'chalk';

export const colorizeStatusText = (status: string) => {
    return status === 'passed'
        ? chalk.green(status)
        : chalk.red(status);
};

export const colorizeTitleText = (title: string) => chalk.white.bgBlue(title);

export const colorizeDurationTime = (duration: number | string) => chalk.yellow(duration);
