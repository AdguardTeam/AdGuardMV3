import React from 'react';
import { NavLink } from 'react-router-dom';

import { reactTranslator } from 'Common/translators/reactTranslator';

import styles from './nav.module.pcss';

const Nav = () => (
    <div className={styles.nav}>
        <NavLink
            className={styles.item}
            exact
            activeClassName={styles.active}
            to="/"
        >
            {reactTranslator.getMessage('options_nav_link_general')}
        </NavLink>
        <NavLink
            className={styles.item}
            activeClassName={styles.active}
            to="/about"
        >
            {reactTranslator.getMessage('options_nav_link_about')}
        </NavLink>
        <NavLink
            className={styles.item}
            activeClassName={styles.active}
            to="/limits"
        >
            {reactTranslator.getMessage('options_nav_link_rule_limits')}
        </NavLink>
    </div>
);

export { Nav };
