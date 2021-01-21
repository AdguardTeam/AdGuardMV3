import {
    action,
    observable,
    makeObservable,
    runInAction,
} from 'mobx';

import { PROTECTION_ENABLED_KEY } from '../../common/constants';
import { log } from '../../common/logger';
import { sender } from '../messaging/sender';
import type { RootStore } from './RootStore';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable protectionEnabled = false;

    @action
    setProtectionEnabled = async (protectionEnabled: boolean) => {
        try {
            const response = await sender.setProtectionEnabled(protectionEnabled);

            runInAction(() => {
                this.protectionEnabled = response[PROTECTION_ENABLED_KEY];
            });
        } catch (err) {
            log.error(err);
        }
    };

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
    };
}
