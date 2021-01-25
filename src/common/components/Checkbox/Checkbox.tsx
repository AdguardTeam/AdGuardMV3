import React from 'react';

import './checkbox.pcss';

type CheckboxProps = {
    id: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox = ({ id, checked, onChange }: CheckboxProps) => {
    return (
        <>
            <input
                type="checkbox"
                id={id}
                className="checkbox__input"
                checked={checked}
                onChange={onChange}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
                htmlFor={id}
                className="checkbox__label"
            />
        </>
    );
};
