import { settings } from './settings';

class App {
    isAppReady = false;

    init = async () => {
        await settings.init();
        this.isAppReady = true;
    };

    isReady = () => this.isAppReady;
}

export const app = new App();
