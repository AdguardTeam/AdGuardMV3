import React, { useEffect } from 'react';
import cn from 'classnames';
import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';

interface RemoveCustomFilterProps {
    title: string;
    description: string;
    confirmModal: boolean,
    onRemove: () => void;
    onConfirmModal: (param: boolean) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export const RemoveCustomFilter = ({
    title,
    description,
    onRemove,
    onConfirmModal,
    confirmModal,
    onChange,
    onSave,
}: RemoveCustomFilterProps) => {
    useEffect(() => {
        onConfirmModal(false);
    }, []);

    if (confirmModal) {
        return (
            <>
                <div className={theme.modal.description}>
                    {reactTranslator.getMessage('options_custom_filter_modal_removed_desc')}
                </div>
                <div className={theme.modal.footer}>
                    <button
                        className={cn(theme.button.middle, theme.button.green, theme.modal.leftBtn)}
                        disabled={title.trim().length === 0}
                        type="button"
                        onClick={() => onConfirmModal(false)}
                    >
                        {reactTranslator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
                    </button>
                    <button
                        type="button"
                        className={cn(theme.button.middle, theme.button.red)}
                        onClick={onRemove}
                    >
                        {reactTranslator.getMessage('options_custom_filter_modal_remove_button')}
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <input
                className={theme.modal.modalInput}
                type="text"
                value={title}
                onChange={onChange}
            />
            {
                description
                && <div className={theme.modal.description}>{description}</div>
            }
            <div className={theme.modal.footer}>
                <button
                    className={cn(theme.button.middle, theme.button.green, theme.modal.leftBtn)}
                    disabled={title.trim().length === 0}
                    type="button"
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_save_button')}
                </button>
                <button
                    type="button"
                    className={cn(theme.button.middle, theme.button.red)}
                    onClick={() => onConfirmModal(true)}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_remove_button')}
                </button>
            </div>
        </>
    );
};
