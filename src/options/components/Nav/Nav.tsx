import React from 'react';
import { NavLink } from 'react-router-dom';

import { translate } from '../../../common/helpers';

import './nav.pcss';

const Nav = () => (
    <div className="nav">
        <NavLink
            className="nav__item"
            exact
            activeClassName="nav__item--active"
            to="/"
        >
            {translate('options_general_settings')}
        </NavLink>
        <NavLink
            className="nav__item"
            activeClassName="nav__item--active"
            to="/about"
        >
            {translate('options_about')}
        </NavLink>
    </div>
);

export { Nav };
