import React from 'react';

import { IconId, Icon } from 'Common/components/ui';

import { Nav } from '../Nav';

import { Notice } from './Notice';

import './sidebar.pcss';

export const Sidebar = () => {
    return (
        <>
            <div className="sidebar__menu" role="menu">
                <button className="sidebar__open-button" type="button">
                    {/* @ts-ignore TODO fix on mobile screen */}
                    <Icon id="MENU" />
                </button>
            </div>
            <div className="sidebar">
                <Icon id={IconId.LOGO} className="sidebar__logo" />
                <Nav />
                <Notice />
            </div>
        </>
    );
};
