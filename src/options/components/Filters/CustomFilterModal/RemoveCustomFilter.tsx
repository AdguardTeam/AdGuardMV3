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
            <div className={theme.modal.itemWrapper}>
                <div className={theme.modal.label}>
                    {reactTranslator.getMessage('options_custom_filter_add_label_name')}
                </div>
                <input
                    className={theme.modal.modalInput}
                    type="text"
                    value={title}
                    onChange={onChange}
                />
            </div>
            {
                description
                && (
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
                )
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
