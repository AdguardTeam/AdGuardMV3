import React from 'react';
import { NavLink } from 'react-router-dom';

import { reactTranslator } from 'Common/translators/reactTranslator';

import styles from './nav.module.pcss';

interface NavProps {
    closeSidebar: () => void,
}

const Nav = ({ closeSidebar }: NavProps) => {
    const onClick = () => {
        closeSidebar();
    };

    return (
        <div className={styles.nav}>
            <NavLink
                className={styles.item}
                exact
                activeClassName={styles.active}
                to="/"
                onClick={onClick}
            >
                {reactTranslator.getMessage('options_nav_link_general')}
            </NavLink>
            <NavLink
                className={styles.item}
                activeClassName={styles.active}
                to="/about"
                onClick={onClick}
            >
                {reactTranslator.getMessage('options_nav_link_about')}
            </NavLink>
            <NavLink
                className={styles.item}
                activeClassName={styles.active}
                to="/limits"
                onClick={onClick}
            >
                {reactTranslator.getMessage('options_nav_link_rule_limits')}
            </NavLink>
        </div>
    );
};

export { Nav };
