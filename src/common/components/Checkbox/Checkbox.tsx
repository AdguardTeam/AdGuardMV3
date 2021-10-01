import React from 'react';

import styles from './checkbox.module.pcss';

type IProps = {
    id: string;
    checked?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox = ({ id, checked, onChange }: IProps) => {
    return (
        <div className={styles.checkboxContainer}>
            <input
                type="checkbox"
                id={id}
                className={styles.checkboxInput}
                checked={checked}
                onChange={onChange}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
                htmlFor={id}
                className={styles.checkboxLabel}
            />
        </div>
    );
};

Checkbox.defaultProps = {
    checked: undefined,
};
