import React from 'react';
import cn from 'classnames';
import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';
import styles from './CustomFilterModal.module.pcss';

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
            <div className={styles.description}>{description}</div>
            <div className={styles.buttonsGroup}>
                <button
                    className={cn(theme.button.middle, theme.button.red, styles.leftBtn)}
                    type="button"
                    onClick={onCancel}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
                </button>
                <button
                    className={cn(theme.button.middle, theme.button.green)}
                    type="button"
                    disabled={title.trim().length === 0}
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_save_button')}
                </button>
            </div>
        </>
    );
};
