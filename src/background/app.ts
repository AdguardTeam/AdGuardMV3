import { settings } from './settings';

export const app = (() => {
    let isReady = false;

    const init = async () => {
        await settings.init();
        isReady = true;
    };

    return {
        isReady: () => isReady,
        init,
    };
})();
