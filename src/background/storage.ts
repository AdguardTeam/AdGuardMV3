export class Storage {
    private storage;

    constructor(storage: chrome.storage.LocalStorageArea) {
        this.storage = storage;
    }

    get = (key: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.storage.get([key], (result: { [x: string]: any; }) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(result[key]);
            });
        });
    };

    set = (key: string, value: any): Promise<void> => {
        return new Promise((resolve, reject) => {
            this.storage.set({ key: value }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            });
        });
    };
}

export const storage = new Storage(chrome.storage.local);
