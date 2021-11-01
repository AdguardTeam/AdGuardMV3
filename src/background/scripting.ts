interface ExecuteScriptOptions {
    file: string,
}

/**
 * Promisified version of browser api method scripting.executeScript, with adjusted options
 *
 * API description: https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript
 * @param tabId
 * @param options
 */
const executeScript = async (tabId: number, options: ExecuteScriptOptions) => {
    const { file } = options;

    const executeScriptOptions = {
        target: { tabId },
        files: [file],
    };

    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript(executeScriptOptions, (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            }
            resolve(result);
        });
    });
};

export const scripting = {
    executeScript,
};
