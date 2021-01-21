import React from 'react';
import { NavLink } from 'react-router-dom';

import { translate } from '../../../common/helpers';

import './nav.pcss';

const Nav = ({ closeSidebar }) => (
    <div className="nav">
        <NavLink
            className="nav__item"
            exact
            activeClassName="nav__item--active"
            to="/"
            onClick={closeSidebar}
        >
            {translate('options_general_settings')}
        </NavLink>
        <NavLink
            className="nav__item"
            activeClassName="nav__item--active"
            to="/about"
            onClick={closeSidebar}
        >
            {translate('options_about')}
        </NavLink>
    </div>
);

export { Nav };
