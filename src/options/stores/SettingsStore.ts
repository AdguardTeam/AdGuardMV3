import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import { DEFAULT_SETTINGS, SETTINGS_NAMES } from 'Common/settings-constants';
import type { RootStore } from './RootStore';
import { sender } from '../messaging/sender';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    settings = DEFAULT_SETTINGS;

    getOptionsData = async () => {
        const { settings } = await sender.getOptionsData();

        runInAction(() => {
            this.settings = settings;
        });
    };

    setSetting = async (key: SETTINGS_NAMES, value: boolean) => {
        await sender.setSetting(key, value);
        this.updateSettingState(key, value);
    };

    @action
    updateSettingState = (key: SETTINGS_NAMES, value: boolean) => {
        this.settings[key] = value;
    };

    @computed
    get noticeHidden() {
        return this.settings[SETTINGS_NAMES.NOTICE_HIDDEN];
    }

    @computed
    get filteringEnabled() {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED] as boolean;
    }
}
