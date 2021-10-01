import React from 'react';
import { Icon, ICON_ID } from 'Common/components/ui';

import styles from 'Common/components/ModalButton/ModalButton.module.pcss';

export type IProps = {
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    message: string
};

export const ModalButton = ({ handleClick, message }: IProps) => (
    <div className={styles.addRuleContainer}>
        <button
            className={styles.addRuleButton}
            onClick={handleClick}
            type="button"
        >
            <Icon id={ICON_ID.PLUS} />
            <span className={styles.addRule}>
                {message}
            </span>
        </button>
    </div>
);
