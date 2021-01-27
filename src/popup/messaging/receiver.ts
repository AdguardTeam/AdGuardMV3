import { MESSAGE_TYPES } from 'Common/constants';
import { log } from 'Common/logger';
import { RootStore } from '../stores/RootStore';

export const getMessageReceiver = (rootStore: RootStore) => {
    const { settingsStore } = rootStore;

    return (message: any) => {
        log.debug('Received message: ', message);
        const { type, data } = message;

        switch (type) {
            case MESSAGE_TYPES.SET_FILTERING_ENABLED: {
                const { protectionEnabled } = data;
                settingsStore.setFilteringEnabled(protectionEnabled);
                break;
            }
            default: {
                throw new Error(`No message handler for type: ${type}`);
            }
        }
    };
};
