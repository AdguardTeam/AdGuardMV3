import {
    action,
    observable,
    makeObservable,
    computed,
} from 'mobx';

import { translate } from '../../common/helpers';
import type { RootStore } from './RootStore';

const INITIAL_STEP = 1;
const LAST_STEP = 4;

export class WizardStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable step = INITIAL_STEP;

    @observable displayWizard = true;

    @computed get isLastStep() {
        return this.step === LAST_STEP;
    }

    @computed get stepName() {
        const stepNames = {
            1: 'experimental',
            2: 'new_tech',
            3: 'fast_work',
            4: 'v3_manifest',
        };

        return translate(stepNames[this.step]);
    }

    @computed get stepDescription() {
        const stepDescriptions = {
            1: 'experimental_desc',
            2: 'new_tech_desc',
            3: 'fast_work_desc',
            4: 'v3_manifest_desc',
        };

        return translate(stepDescriptions[this.step]);
    }

    @computed get stepIconId() {
        const stepIconId = {
            1: 'experiment',
            2: 'new_tech',
            3: 'fast_work',
            4: 'chrome_logo',
        };

        return stepIconId[this.step];
    }

    @computed get buttonText() {
        switch (this.step) {
            case LAST_STEP:
                return translate('lets_start');
            default:
                return translate('next');
        }
    }

    @action
    setStep = async (step) => {
        this.step = step;
    };

    @action
    setNextStep = async () => {
        this.step += 1;
    };

    @action
    skipWizard = async () => {
        this.displayWizard = false;
        this.step = INITIAL_STEP;
    };
}
