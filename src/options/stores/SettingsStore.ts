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
            await sender.setProtectionEnabled(protectionEnabled);
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.protectionEnabled = protectionEnabled;
        });
    };

    @action
    getProtectionEnabled = async () => {
        let isProtectionEnabled = this.protectionEnabled;

        try {
            isProtectionEnabled = await sender.getProtectionEnabled() as boolean;
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.protectionEnabled = isProtectionEnabled;
        });
    };
}
