import React from 'react';
import cn from 'classnames';
import { NavLink } from 'react-router-dom';

import { Icon, IconId } from 'Common/components/ui';

import styles from './NavOption.module.pcss';

export interface IProps {
    id: string;
    iconId?: IconId;
    message: string;
    messageDesc: string;
    to: string;
}

export const NavOption = ({
    id,
    iconId,
    message,
    messageDesc,
    to = '',
}: IProps) => (
    <NavLink
        key={id}
        className={styles.navLink}
        to={to}
    >
        <div className={cn(styles.optionItem, styles.itemNav)}>
            <div className={styles.option}>
                {iconId && <Icon id={iconId} />}
                <label
                    htmlFor={id}
                    className={styles.optionLabel}
                >
                    {message}
                    {messageDesc && (
                        <div className={styles.optionLabelDesc}>
                            {messageDesc}
                        </div>
                    )}
                </label>
            </div>
            <Icon className={styles.arrow} id={IconId.ARROW} />
        </div>
    </NavLink>
);
