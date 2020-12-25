import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';

const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        switch (type) {
        case MESSAGES.SET_PROTECTION_ENABLED: {
            settingsStore.setProtectionEnabled(data[PROTECTION_ENABLED_KEY]);
            return true;
        }
        default:
            return true;
        }
    };
};

export default getMessageReceiver;
