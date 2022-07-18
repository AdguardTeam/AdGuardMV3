import React from 'react';
import cn from 'classnames';

import { theme } from 'Common/styles';

import styles from './CheckboxOption.module.pcss';

interface ChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface IProps {
    id: string;
    checked?: boolean;
    message?: string;
    onChange: ChangeHandler;
    integrated?: boolean,
}

export const CheckboxOption = ({
    id,
    checked,
    message,
    onChange,
}: IProps) => {
    return (
        <label className={cn(theme.checkbox.container, styles.optionItem)} htmlFor={String(id)}>
            <input type="checkbox" id={String(id)} checked={checked} onChange={onChange} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <span className={cn(theme.checkbox.checkmark, theme.checkbox.option)} />
            <span>
                {message}
            </span>
        </label>
    );
};
