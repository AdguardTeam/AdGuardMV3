import React from 'react';
import cn from 'classnames';
import { Icon, IconId } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { NavLink } from 'react-router-dom';

import styles from './NavOption.module.pcss';

export interface IProps {
    id: string;
    iconId?: IconId;
    messageKey: string;
    messageKeyDesc: string;
    to: string;
}

export const NavOption = ({
    id,
    iconId,
    messageKey,
    messageKeyDesc,
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
                    {reactTranslator.getMessage(messageKey)}
                    {messageKeyDesc && (
                        <div className={styles.optionLabelDesc}>
                            {reactTranslator.getMessage(messageKeyDesc) as string}
                        </div>
                    )}
                </label>
            </div>
            <Icon id={IconId.ARROW} />
        </div>
    </NavLink>
);
