import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import s from './CustomFilterModal.module.pcss';

interface RemoveCustomFilterProps {
    title: string;
    description: string;
    onRemove: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export const RemoveCustomFilter = ({
    title,
    description,
    onRemove,
    onChange,
    onSave,
}: RemoveCustomFilterProps) => {
    return (
        <>
            <input
                className={s.modalInput}
                type="text"
                value={title}
                onChange={onChange}
            />
            {
                description
                && <div className={s.description}>{description}</div>
            }
            <div className={s.buttonsGroup}>
                <button
                    type="button"
                    className={s.btnDelete}
                    onClick={onRemove}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_remove_button')}
                </button>
                <button
                    className={s.btnSave}
                    disabled={title.trim().length === 0}
                    type="button"
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_save_button')}
                </button>
            </div>
        </>
    );
};
