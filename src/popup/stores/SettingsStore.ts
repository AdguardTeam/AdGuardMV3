import {
    action,
    observable,
    makeObservable,
    runInAction,
} from 'mobx';

import { log } from 'Common/logger';
import { sender } from '../messaging/sender';
import type { RootStore } from './RootStore';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable protectionEnabled: boolean = false;

    @action
    toggleProtectionEnabled = async (protectionEnabled: boolean) => {
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
    setProtectionEnabled = async (protectionEnabled: boolean) => {
        this.protectionEnabled = protectionEnabled;
    };

    @action
    getProtectionEnabled = async () => {
        let isProtectionEnabled = this.protectionEnabled;

        try {
            isProtectionEnabled = await sender.getProtectionEnabled();
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.protectionEnabled = isProtectionEnabled;
        });
    };
}
