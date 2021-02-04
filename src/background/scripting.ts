const executeScript = async (tabId: number, options: any) => {
    const { file } = options;

    const executeScriptOptions = {
        target: { tabId },
        files: [file],
    };

    return new Promise((resolve, reject) => {
        // TODO use typings for v3 version api, when they'll be available
        // @ts-ignore
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
