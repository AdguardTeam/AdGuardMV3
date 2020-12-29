import {
    action,
    observable,
    makeObservable,
    runInAction,
} from 'mobx';

import { PROTECTION_ENABLED_KEY } from '../../../common/constants';
import { log } from '../../../common/logger';
import { sender } from '../../messaging/sender';

export class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable protectionEnabled = false;

    @action
    setProtectionEnabled = async (protectionEnabled) => {
        try {
            const response = await sender.setProtectionEnabled(protectionEnabled);

            runInAction(() => {
                this.protectionEnabled = response[PROTECTION_ENABLED_KEY];
            });
        } catch (err) {
            log.error(err);
        }
    }

    @action
    getProtectionEnabled = async () => {
        try {
            const response = await sender.getProtectionEnabled();

            runInAction(() => {
                this.protectionEnabled = response[PROTECTION_ENABLED_KEY];
            });
        } catch (err) {
            log.error(err);
        }
    }
}
