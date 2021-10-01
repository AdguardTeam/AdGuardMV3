import React from 'react';
import cn from 'classnames';
import { Icon, ICON_ID } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { NavLink } from 'react-router-dom';

import styles from './NavOption.module.pcss';

export interface IProps {
    id: string;
    iconId?: ICON_ID;
    messageKey: string;
    to: string;
}

export const NavOption = ({
    id,
    iconId,
    messageKey,
    to = '',
}: IProps) => (
    <NavLink
        key={id}
        className={styles.navLink}
        to={to}
    >
        <div className={cn(styles.optionItem, styles.itemNav)}>
            <div>
                {iconId && <Icon id={iconId} />}
                <label
                    htmlFor={id}
                    className={styles.optionLabel}
                >
                    {reactTranslator.getMessage(messageKey)}
                </label>
            </div>
            <Icon id={ICON_ID.ARROW} />
        </div>
    </NavLink>
);
