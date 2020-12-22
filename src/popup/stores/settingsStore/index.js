import {
    action,
    observable,
} from 'mobx';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTitle = 'Popup';

    @action
    setCurrentTitle = (title) => {
        this.currentTitle = title;
    }
}

export default SettingsStore;
