import {
    action,
    observable,
    makeObservable,
    computed,
    runInAction,
} from 'mobx';

import type { RootStore } from './RootStore';
import { sender } from '../messaging/sender';

const INITIAL_STEP = 1;
const LAST_STEP = 4;

interface StepInfo {
    nameKey: string;
    descriptionKey: string;
    icon: string;
}

const stepInfoMap: { [key: number]: StepInfo } = {
    1: {
        nameKey: 'popup_steps_experimental_title',
        descriptionKey: 'popup_steps_experimental_description',
        icon: 'experiment',
    },
    2: {
        nameKey: 'popup_steps_new_tech_title',
        descriptionKey: 'popup_steps_new_tech_description',
        icon: 'new_tech',
    },
    3: {
        nameKey: 'popup_steps_fast_work_title',
        descriptionKey: 'popup_steps_fast_work_description',
        icon: 'fast_work',
    },
    4: {
        nameKey: 'popup_steps_v3_manifest_title',
        descriptionKey: 'popup_steps_v3_manifest_description',
        icon: 'chrome_logo',
    },
};

export class WizardStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable step = INITIAL_STEP;

    @observable wizardEnabled = true;

    @computed get isLastStep() {
        return this.step === LAST_STEP;
    }

    @computed get stepInfo() {
        return stepInfoMap[this.step];
    }

    @computed get buttonTextKey() {
        switch (this.step) {
            case LAST_STEP:
                return 'popup_wizard_start_button';
            default:
                return 'popup_wizard_next_button';
        }
    }

    @action
    setStep = (step: number) => {
        this.step = step;
    };

    @action
    setNextStep = () => {
        this.step += 1;
    };

    @action
    skipWizard = async () => {
        await sender.disableWizard();
        runInAction(() => {
            this.wizardEnabled = false;
            this.step = INITIAL_STEP;
        });
    };

    @action
    setWizardEnabled = (wizardEnabled: boolean) => {
        this.wizardEnabled = wizardEnabled;
    };
}
