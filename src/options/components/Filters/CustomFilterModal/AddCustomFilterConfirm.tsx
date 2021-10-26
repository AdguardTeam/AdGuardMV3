import React from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import styles from './CustomFilterModal.module.pcss';

type ConfirmAddCustomProps = {
    description: string | null,
    onCancel: (e: React.MouseEvent) => void;
    onSave: () => void;
};

export const AddCustomFilterConfirm = ({
    description,
    onCancel,
    onSave,
}: ConfirmAddCustomProps) => {
    return (
        <>
            <div className={styles.description}>{description}</div>
            <div className={styles.buttonsGroup}>
                <button
                    className={styles.btnDelete}
                    type="button"
                    onClick={onCancel}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
                </button>
                <button
                    className={styles.btnSave}
                    type="button"
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_confirm_save_button')}
                </button>
            </div>
        </>
    );
};
