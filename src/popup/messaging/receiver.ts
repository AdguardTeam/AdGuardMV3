import { MESSAGE_TYPES, PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';

export const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return async (message) => {
        log.debug('Received message: ', message);
        const { type, data } = message;

        const REQUEST_TYPE_TO_HANDLER_MAP = {
            [MESSAGE_TYPES.SET_PROTECTION_ENABLED]: (data) => {
                settingsStore.setProtectionEnabled(data[PROTECTION_ENABLED_KEY]);
                return true;
            },
        };

        if (!Object.prototype.hasOwnProperty.call(REQUEST_TYPE_TO_HANDLER_MAP, type)) {
            log.warn(`There is no such message type ${type}`);
            return undefined;
        }

        return REQUEST_TYPE_TO_HANDLER_MAP[type](data);
    };
};
