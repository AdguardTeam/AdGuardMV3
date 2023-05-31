import React from 'react';
import cn from 'classnames';

import { theme } from 'Common/styles';

import styles from './CheckboxOption.module.pcss';

interface ChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement>): void;
}

interface CheckboxProps {
    id: string;
    checked?: boolean;
    message?: string;
    onChange: ChangeHandler;
}

export const CheckboxOption: React.FunctionComponent<CheckboxProps> = ({
    id,
    checked,
    message,
    onChange,
}) => {
    return (
        <label className={cn(theme.checkbox.container, styles.optionItem)} htmlFor={String(id)}>
            <input type="checkbox" id={String(id)} checked={checked} onChange={onChange} />
            <span className={cn(theme.checkbox.checkmark, theme.checkbox.option)} />
            <span>
                {message}
            </span>
        </label>
    );
};
