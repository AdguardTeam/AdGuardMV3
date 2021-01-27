import {
    action,
    observable,
    makeObservable,
    runInAction,
} from 'mobx';

import { log } from 'Common/logger';
import { MESSAGE_TYPES, PopupData } from 'Common/constants';
import { sendMessage } from 'Common/helpers';
import { sender } from '../messaging/sender';
import type { RootStore } from './RootStore';

export class SettingsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    popupDataReady = false;

    @observable
    filteringEnabled: boolean = false;

    @action
    toggleFilteringEnabled = async (filteringEnabled: boolean) => {
        try {
            await sender.setFilteringEnabled(filteringEnabled);
        } catch (err) {
            log.error(err);
            return;
        }

        runInAction(() => {
            this.filteringEnabled = filteringEnabled;
        });
    };

    @action
    setFilteringEnabled = async (filteringEnabled: boolean) => {
        this.filteringEnabled = filteringEnabled;
    };

    @action
    getPopupData = async () => {
        const popupData = await sendMessage(MESSAGE_TYPES.GET_POPUP_DATA) as PopupData;
        runInAction(() => {
            this.popupDataReady = true;
            this.filteringEnabled = popupData.filteringEnabled;
            this.rootStore.wizardStore.setWizardEnabled(popupData.wizardEnabled);
        });
    };
}
