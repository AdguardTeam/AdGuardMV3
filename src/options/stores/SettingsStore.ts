import {
    action,
    observable,
    makeObservable,
    runInAction,
    computed,
} from 'mobx';

import type { RootStore } from './RootStore';
import { sender } from '../messaging/sender';
import { DEFAULT_SETTINGS, SETTINGS_NAMES } from '../../background/settings/settings-constants';

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
    get isNoticeHidden() {
        return this.settings[SETTINGS_NAMES.NOTICE_HIDDEN];
    }

    @computed
    get isFilteringEnabled() {
        return this.settings[SETTINGS_NAMES.FILTERING_ENABLED];
    }
}
