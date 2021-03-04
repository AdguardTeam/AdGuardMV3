import React from 'react';

import { Icon } from 'Common/components/ui/Icon';
import { ICON_ID } from 'Common/components/ui/Icons';
import { Nav } from '../Nav';
import { Notice } from '../Notice';

import './sidebar.pcss';

export const Sidebar = () => {
    return (
        <div>
            <div className="sidebar__menu" role="menu">
                <button className="sidebar__open-button" type="button">
                    {/* @ts-ignore TODO fix on mobile screen */}
                    <Icon id="MENU" />
                </button>
            </div>
            <div className="sidebar">
                <Icon id={ICON_ID.LOGO} className="sidebar__logo" />
                <Nav />
                <Notice />
            </div>
        </div>
    );
};
