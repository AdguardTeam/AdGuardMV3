import React, { useRef, Fragment } from 'react';
import cn from 'classnames';

import { Icon, IconId } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { Checkbox } from 'Common/components/Checkbox';
import { translator } from 'Common/translators/translator';
import { TitleTooltip } from 'Common/components/TitleTooltip';

import styles from './CheckboxOption.module.pcss';

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
    tooltipMessage?: string;
    onClick?: () => void;
    onChange: ChangeHandler;
    className?: string,
    iconClass?: string,
    containerClass?: string,
    integrated?: boolean,
}

export const CheckboxOption = ({
    id,
    iconId,
    checked,
    messageKey,
    messageKeyDesc,
    message = messageKey && translator.getMessage(messageKey),
    tooltipMessage = message,
    onClick,
    onChange,
    className = '',
    iconClass = '',
    containerClass = '',
    integrated = false,
}: IProps) => {
    const ref = useRef(null);

    return (
        <Fragment key={id}>
            <div className={cn(styles.optionItem, containerClass)}>
                <button
                    className={styles.button}
                    type="button"
                    onClick={onClick}
                >
                    {iconId && (
                        <span className={styles.icon}>
                            <Icon id={iconId} className={iconClass} />
                        </span>
                    )}
                    <label
                        htmlFor={id}
                        className={cn(styles.optionLabel, className)}
                        ref={ref}
                    >
                        {message}
                        {messageKeyDesc && (
                            <div className={styles.optionLabelDesc}>
                                {reactTranslator.getMessage(messageKeyDesc) as string}
                            </div>
                        )}
                    </label>
                </button>
                {!integrated && (
                    <Checkbox id={id} checked={checked} onChange={onChange} />
                )}
            </div>
            <TitleTooltip ref={ref}>{tooltipMessage}</TitleTooltip>
        </Fragment>
    );
};
