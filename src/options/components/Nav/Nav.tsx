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

    const NAVIGATION_LINKS = {
        ABOUT: '/about',
        LIMITS: '/limits',
    };

    return (
        <div className={styles.nav}>
            <NavLink
                className={styles.item}
                activeClassName={styles.active}
                to="/"
                isActive={(match, location) => {
                    return !Object.values(NAVIGATION_LINKS).some((link) => location.pathname.includes(link));
                }}
                onClick={onClick}
            >
                {reactTranslator.getMessage('options_nav_link_general')}
            </NavLink>
            <NavLink
                className={styles.item}
                activeClassName={styles.active}
                to={NAVIGATION_LINKS.ABOUT}
                onClick={onClick}
            >
                {reactTranslator.getMessage('options_nav_link_about')}
            </NavLink>
            <NavLink
                className={styles.item}
                activeClassName={styles.active}
                to={NAVIGATION_LINKS.LIMITS}
                onClick={onClick}
            >
                {reactTranslator.getMessage('options_nav_link_rule_limits')}
            </NavLink>
        </div>
    );
};

export { Nav };
