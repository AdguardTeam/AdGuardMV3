import {
    action,
    makeObservable,
    observable,
} from 'mobx';
import { nanoid } from 'nanoid';

import { ICON_ID } from 'Common/components/ui';
import type { RootStore } from './RootStore';

type Notifications = {
    id: string,
    icon: ICON_ID | undefined,
    description: string,
};

export class UiStore {
    public rootStore: RootStore;

    @observable
    notifications: Notifications[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action
    addNotification = (description: string, icon?: ICON_ID) => {
        const id = nanoid();
        this.notifications.push({
            id,
            icon,
            description,
        });
        return id;
    };

    @action
    removeNotification(id: string) {
        this.notifications = this.notifications
            .filter((notification) => notification.id !== id);
    }
}
