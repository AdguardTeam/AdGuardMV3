import React from 'react';

import { Icon, IconId } from 'Common/components/ui';

import styles from './Button.module.pcss';

export type ButtonProps = {
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    message: string,
    icon: IconId,
};

export const Button = ({ handleClick, message, icon }: ButtonProps) => (
    <div className={styles.addRuleContainer}>
        <button
            className={styles.addRuleButton}
            onClick={handleClick}
            type="button"
        >
            <Icon id={icon} />
            <span className={styles.addRule}>
                {message}
            </span>
        </button>
    </div>
);
