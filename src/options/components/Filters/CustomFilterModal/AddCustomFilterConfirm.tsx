import React from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';

type ConfirmAddCustomProps = {
    description: string | null,
    onCancel: () => void;
    onSave: () => void;
};

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
            <button
                type="button"
                onClick={onCancel}
            >
                {reactTranslator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
            </button>
            <button
                type="button"
                onClick={onSave}
            >
                {reactTranslator.getMessage('options_custom_filter_modal_confirm_save_button')}
            </button>
        </>
    );
};
