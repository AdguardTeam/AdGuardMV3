import React from 'react';

type ConfirmAddCustomProps = {
    description: string | null,
    onCancel: () => void;
    onSave: () => void;
};

// FIXME translate buttons
export const AddCustomFilterConfirm = (
    {
        description,
        onCancel,
        onSave,
    }: ConfirmAddCustomProps,
) => {
    return (
        <>
            <div>{description}</div>
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="button" onClick={onSave}>Save</button>
        </>
    );
};
