import React, { useState } from 'react';
import classNames from 'classnames';

import { IconId, Icon } from 'Common/components/ui';

import { Nav } from '../Nav';

import { Notice } from './Notice';

import './sidebar.pcss';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openSidebar = () => setIsOpen(true);
    const closeSidebar = () => setIsOpen(false);

    const className = classNames('sidebar', {
        /* styles only for mobile markup */
        'sidebar--open': isOpen,
    });

    return (
        <>
            {isOpen ? (
                <div
                    role="menu"
                    tabIndex={0}
                    onClick={closeSidebar}
                    onKeyUp={closeSidebar}
                    className="sidebar__overlay"
                />
            ) : (
                <div className="sidebar__menu" role="menu">
                    <button onClick={openSidebar} className="sidebar__open-button" type="button">
                        <Icon id={IconId.MENU} />
                    </button>
                </div>
            )}

            <div className={className}>
                <Icon id={IconId.LOGO} className="sidebar__logo" />
                <Nav closeSidebar={closeSidebar} />
                <Notice />
            </div>
        </>
    );
};
