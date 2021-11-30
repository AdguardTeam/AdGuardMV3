import React from 'react';
import cn from 'classnames';
import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';

interface RemoveCustomFilterProps {
    title: string;
    description: string;
    openConfirmModal: (param: boolean) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export const RemoveCustomFilter = ({
    title,
    description,
    openConfirmModal,
    onChange,
    onSave,
}: RemoveCustomFilterProps) => {
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
                    onClick={() => openConfirmModal(true)}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_remove_button')}
                </button>
            </div>
        </>
    );
};
