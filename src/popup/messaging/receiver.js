import { MESSAGES, PROTECTION_ENABLED_KEY } from '../../common/constants';

export const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        const receiver = {
            [MESSAGES.SET_PROTECTION_ENABLED]: (data) => {
                settingsStore.setProtectionEnabled(data[PROTECTION_ENABLED_KEY]);
                return true;
            },
        };

        return receiver[type](data);
    };
};
