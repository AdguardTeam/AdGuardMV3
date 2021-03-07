import {
    action,
    computed,
    makeObservable,
    observable,
} from 'mobx';

import type { RootStore } from './RootStore';

export class SearchStore {
    public rootStore: RootStore;

    @observable isSearchOpen = false;

    @observable searchValue = '';

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action
    openSearch = () => {
        this.isSearchOpen = true;
    };

    @action
    closeSearch = () => {
        this.isSearchOpen = false;
        this.searchValue = '';
    };

    @action
    setSearchValue = (value: string) => {
        this.searchValue = value;
    };

    @computed
    get searchQuery() {
        const preparedSearchValue = this.searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(preparedSearchValue, 'ig');
    }

    matchesSearchQuery = (title: string) => {
        return title.match(this.searchQuery);
    };
}
