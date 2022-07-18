import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from 'Options/stores';

import { Notification } from './Notification';
import styles from './notifications.module.pcss';

export const Notifications = observer(() => {
    const { uiStore } = useContext(rootStore);

    const { notifications } = uiStore;

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className={styles.notifications}>
            {notifications.map((notification) => {
                const { id, description, icon } = notification;
                return (
                    <Notification
                        key={id}
                        id={id}
                        icon={icon}
                        description={description}
                    />
                );
            })}
        </div>
    );
});
