import React from 'react';
import cn from 'classnames';

import { Icon, IconId } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { Checkbox } from 'Common/components/Checkbox';
import { translator } from 'Common/translators/translator';

import { HighlightSearch } from '../HighlightSearch';

import styles from './SwitcherOption.module.pcss';

interface ChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface IProps {
    id: string;
    iconId?: IconId;
    checked?: boolean;
    messageKey?: string;
    messageKeyDesc?: string;
    message?: string;
    onClick?: () => void;
    onChange?: ChangeHandler;
    className?: string,
    iconClass?: string,
    containerClass?: string,
    integrated?: boolean,
}

export const SwitcherOption = ({
    id,
    iconId,
    checked,
    messageKey,
    messageKeyDesc,
    message = messageKey && translator.getMessage(messageKey),
    onClick,
    onChange,
    className = '',
    iconClass = '',
    containerClass = '',
    integrated = false,
}: IProps) => {
    const content = () => {
        return (
            <>
                {iconId && (
                    <span className={styles.icon}>
                        <Icon id={iconId} className={iconClass} />
                    </span>
                )}
                <div className={cn(styles.optionLabel, className)}>
                    {message && (
                        <HighlightSearch str={message} />
                    )}
                    {messageKeyDesc && (
                        <div className={styles.optionLabelDesc}>
                            {reactTranslator.getMessage(messageKeyDesc) as string}
                        </div>
                    )}
                </div>
            </>
        );
    };
    return (
        <label
            className={cn(
                styles.optionItem, containerClass, { [styles.disabled]: integrated },
            )}
            htmlFor={id}
            key={id}
        >
            {onClick ? (
                <button
                    className={styles.button}
                    type="button"
                    onClick={onClick}
                >
                    {content()}
                </button>
            ) : content()}
            {integrated || !onChange ? (
                <div className={styles.optionLabelDesc}>
                    {reactTranslator.getMessage('options_base_filter')}
                </div>
            ) : <Checkbox id={id} checked={checked} onChange={onChange} />}
        </label>
    );
};
