import React from 'react';
import { action, makeObservable, observable } from 'mobx';
import { nanoid } from 'nanoid';

import { IconId } from 'Common/components/ui';

import type { RootStore } from './RootStore';

type Notifications = {
    id: string,
    icon: IconId | undefined,
    description: string | React.ReactNode,
};

export class UiStore {
    public rootStore: RootStore;

    @observable
    notifications: Notifications[] = [];

    @observable
    loader = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @action
    addNotification = (description: string | React.ReactNode, icon?: IconId) => {
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

    @action
    setLoader = (value: boolean) => {
        this.loader = value;
    };
}
