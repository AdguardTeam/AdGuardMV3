import readline from 'readline';

import fse from 'fs-extra';

/**
 * Reads first N lines from requested file via stream
 * @param absoluteFilename absolute path to filter
 * @param lines amount of lines to read
 */
export const readNLinesFromFileWithStream = async (absoluteFilename: string, lines: number): Promise<string[]> => {
    return new Promise((resolve) => {
        const readStream = fse.createReadStream(absoluteFilename, { encoding: 'utf-8' });
        const lineReader = readline.createInterface({ input: readStream });

        let lineCounter = 0;
        const wantedLines: string[] = [];

        lineReader.on('line', (line) => {
            lineCounter += 1;
            wantedLines.push(line);
            if (lineCounter === lines) {
                lineReader.close();
            }
        });

        lineReader.on('close', () => {
            resolve(wantedLines);
        });
    });
};
