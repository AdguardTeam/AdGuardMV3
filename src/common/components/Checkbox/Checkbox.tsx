import React from 'react';

import './checkbox.pcss';

export const Checkbox = ({ id, checked, onChange }) => {
    return (
        <>
            <input type="checkbox" id={id} className="checkbox__input" checked={checked} onChange={onChange} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor={id} className="checkbox__label" />
        </>
    );
};
