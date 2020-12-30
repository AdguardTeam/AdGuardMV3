import { useState } from 'react';
import cn from 'classnames';

import { Nav } from '../Nav';
import { Icon } from '../../../common/components/ui/Icon';

import './index.pcss';

export const Sidebar = () => {
    return (
        <>
            <div className="sidebar__menu" role="menu">
                <button className="sidebar__open-button" type="button">
                    <Icon id="menu" className="icon--menu" />
                </button>
            </div>
            <div className="sidebar">
                <Icon id="logo" classname="icon--logo sidebar__logo" />
                <Nav />
            </div>
        </>
    );
};
