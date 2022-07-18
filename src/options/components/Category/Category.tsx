import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, IconId } from 'Common/components/ui';

import style from './Category.module.pcss';

interface CategoryProps {
    children: ReactElement,
    navLink: string;
    headerName: string;
    headerDesc?: string;
}

export const Category = ({
    children,
    navLink,
    headerName,
    headerDesc,
}: CategoryProps) => {
    return (
        <>
            <div className={style.header}>
                <NavLink to={navLink}>
                    <Icon id={IconId.ARROW_NAV} />
                </NavLink>
                <div className={style.headerName}>
                    <div className={style.headerNameIn}>
                        {headerName}
                    </div>
                    {headerDesc && (
                        <div className={style.headerDesc}>
                            {headerDesc}
                        </div>
                    )}
                </div>
            </div>
            {children}
        </>
    );
};

Category.defaultProps = {
    headerDesc: undefined,
};
