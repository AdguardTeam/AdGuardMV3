import { action, makeObservable, observable } from 'mobx';

import type { RootStore } from './RootStore';

export enum STEPS {
    ADD_CUSTOM_FILTER = 'ADD_CUSTOM_FILTER',
    ADD_CUSTOM_FILTER_CONFIRM = 'ADD_CUSTOM_FILTER_CONFIRM',
    REMOVE_CUSTOM_FILTER = 'REMOVE_CUSTOM_FILTER',
    CONFIRM_REMOVE_FILTER = 'CONFIRM_REMOVE_FILTER',
    SAVE_CHANGES = 'SAVE_CHANGES',
}

const DEFAULT_STEP = STEPS.ADD_CUSTOM_FILTER;

export class CustomFilterModalStore {
    public rootStore: RootStore;

    @observable
    isModalOpen = false;

    @observable
    filterIdInModal: null | number = null;

    @observable
    currentStep = DEFAULT_STEP;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action
    openModal = () => {
        this.isModalOpen = true;
    };

    @action
    closeModal = () => {
        this.isModalOpen = false;
        this.filterIdInModal = null;
        this.currentStep = DEFAULT_STEP;
    };

    @action
    setCurrentStep = (step: STEPS) => {
        this.currentStep = step;
    };

    @action
    openRemoveCustomFilterModal = (filterId: number) => {
        this.filterIdInModal = filterId;
        this.setCurrentStep(STEPS.REMOVE_CUSTOM_FILTER);
        this.openModal();
    };

    switchToAddCustomFilterConfirmStep = () => {
        this.setCurrentStep(STEPS.ADD_CUSTOM_FILTER_CONFIRM);
    };

    switchToConfirmRemoveStep = () => {
        this.setCurrentStep(STEPS.CONFIRM_REMOVE_FILTER);
    };

    switchToSaveChangesStep = () => {
        this.setCurrentStep(STEPS.SAVE_CHANGES);
    };
}
