import React from 'react';
import cn from 'classnames';

import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';

type ConfirmAddCustomProps = {
    title: string | '',
    description: string | null,
    onCancel: (e: React.MouseEvent) => void;
    onSave: (e: React.MouseEvent) => void;
};

export const AddCustomFilterConfirm = ({
    title,
    description,
    onCancel,
    onSave,
}: ConfirmAddCustomProps) => {
    return (
        <>
            {description && (
                <div className={cn(theme.modal.itemWrapper, theme.modal.disabled)}>
                    <div className={theme.modal.label}>
                        {reactTranslator.getMessage('options_custom_filter_add_label_description')}
                    </div>
                    <div className={theme.modal.filterDescriptionWrapper}>
                        <div className={cn(theme.modal.filterDescription, theme.modal.name)}>
                            {description}
                        </div>
                    </div>
                </div>
            )}
            <div className={theme.modal.footer}>
                <button
                    className={cn(theme.button.middle, theme.button.green, theme.modal.leftBtn)}
                    type="button"
                    disabled={title.trim().length === 0}
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_add_add_button')}
                </button>
                <button
                    className={cn(theme.button.middle, theme.button.red)}
                    type="button"
                    onClick={onCancel}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
                </button>
            </div>
        </>
    );
};
