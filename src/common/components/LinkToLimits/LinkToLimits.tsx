import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './LinkToLimits.module.pcss';

export const LinkToLimits = (s: string) => {
    return (
        <NavLink
            key="/limits"
            className={styles.notificationLink}
            to="/limits"
        >
            <span>
                {s}
            </span>
        </NavLink>
    );
};

export const NewLine = () => <br />;
