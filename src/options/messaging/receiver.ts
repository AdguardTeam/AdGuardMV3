import { MESSAGE_TYPES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';
import type { RootStore } from '../stores/RootStore';

export const getMessageReceiver = (rootStore: RootStore) => {
    const { settingsStore } = rootStore;

    return async (message: any) => {
        log.debug('Received message: ', message);
        const { type, data } = message;

        switch (type) {
            case MESSAGE_TYPES.SET_PROTECTION_ENABLED: {
                settingsStore.setProtectionEnabled(data[PROTECTION_ENABLED_KEY]);
                break;
            }
            default: {
                throw new Error(`No message handler for type: ${type}`);
            }
        }
    };
};
