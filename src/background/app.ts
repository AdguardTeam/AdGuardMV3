import { settings } from './settings';

class App {
    isAppReady = false;

    init = async () => {
        if (this.isAppReady) {
            return;
        }
        await settings.init();
        this.isAppReady = true;
    };
}

export const app = new App();
