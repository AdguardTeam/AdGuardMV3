import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { Icon, ICON_ID } from 'Common/components/ui';
import { rootStore } from '../../stores';
import styles from './notifications.module.pcss';

interface NotificationProps {
    id: string
    description: string,
    icon: ICON_ID | undefined,
}

export const Notification = ({ id, description, icon }: NotificationProps) => {
    const [notificationOnClose, setNotificationOnClose] = useState(false);

    const { uiStore } = useContext(rootStore);

    const displayTimeoutAnimationMs = 5000;
    const displayTimeoutMs = 5300;

    useEffect(() => {
        const displayTimeoutAnimationId = setTimeout(() => {
            setNotificationOnClose(true);
        }, displayTimeoutAnimationMs);

        const displayTimeout = setTimeout(() => {
            uiStore.removeNotification(id);
        }, displayTimeoutMs);

        return () => {
            clearTimeout(displayTimeoutAnimationId);
            clearTimeout(displayTimeout);
        };
    }, [id, uiStore]);

    const notificationClassnames = cn(styles.notification, {
        [styles.close]: notificationOnClose,
    });

    const close = () => {
        setNotificationOnClose(true);
        setTimeout(() => {
            uiStore.removeNotification(id);
        }, 300);
    };

    return (
        <div className={notificationClassnames}>
            {icon && (
                <Icon id={icon} className={styles.icon} />
            )}
            <div className={styles.description}>{description}</div>
            <button
                type="button"
                className={styles.notificationClose}
                onClick={close}
            >
                <Icon id={ICON_ID.CROSS} className={cn(styles.icon, styles.close)} />
            </button>
        </div>
    );
};
