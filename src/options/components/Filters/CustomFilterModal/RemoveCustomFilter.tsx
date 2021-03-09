import React from 'react';
import { reactTranslator } from 'Common/translators/reactTranslator';

import s from './CustomFilterModal.module.pcss';

interface RemoveCustomFilterProps {
    title: string;
    description: string;
    onRemove: () => void;
}

export const RemoveCustomFilter = ({ title, description, onRemove }: RemoveCustomFilterProps) => {
    return (
        <>
            <div className={s.title}>{title}</div>
            {
                description
                && <div className={s.description}>{description}</div>
            }
            <button
                type="button"
                onClick={onRemove}
            >
                {reactTranslator.getMessage('options_custom_filter_modal_delete')}
            </button>
        </>
    );
};
