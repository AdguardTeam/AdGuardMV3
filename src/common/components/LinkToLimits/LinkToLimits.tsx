import React from 'react';
import { Link } from 'react-router-dom';

import styles from './LinkToLimits.module.pcss';

export const LinkToLimits = (s: string) => {
    return (
        <Link
            className={styles.notificationLink}
            to="/limits"
        >
            {s}
        </Link>
    );
};
