import React from 'react';
import { NavLink } from 'react-router-dom';

import { reactTranslator } from 'Common/translators/reactTranslator';

import './nav.pcss';

const Nav = () => (
    <div className="nav">
        <NavLink
            className="nav__item"
            exact
            activeClassName="nav__item--active"
            to="/"
        >
            {reactTranslator.getMessage('options_nav_link_general')}
        </NavLink>
        <NavLink
            className="nav__item"
            activeClassName="nav__item--active"
            to="/about"
        >
            {reactTranslator.getMessage('options_nav_link_about')}
        </NavLink>
    </div>
);

export { Nav };
