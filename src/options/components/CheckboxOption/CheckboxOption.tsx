import React, { useRef, Fragment } from 'react';
import { Icon, ICON_ID } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { Checkbox } from 'Common/components/Checkbox';
import cn from 'classnames';

import { TitleTooltip } from 'Common/components/TitleTooltip';
import styles from './CheckboxOption.module.pcss';

interface ChangeHandler {
    (e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface IProps {
    id: string;
    iconId?: ICON_ID;
    checked?: boolean;
    messageKey?: string;
    message?: string;
    tooltipMessage?: string;
    onChange: ChangeHandler;
    className?: string,
    iconClass?: string,
    containerClass?: string,
}

export const CheckboxOption = ({
    id,
    iconId,
    checked,
    messageKey,
    message = messageKey && reactTranslator.getMessage(messageKey) as string,
    tooltipMessage = message,
    onChange,
    className = '',
    iconClass = '',
    containerClass = '',
}: IProps) => {
    const ref = useRef(null);

    return (
        <Fragment key={id}>
            <div className={cn(styles.optionItem, containerClass)}>
                <div>
                    {iconId && <Icon id={iconId} className={iconClass} />}
                    <label
                        htmlFor={id}
                        className={cn(styles.optionLabel, className)}
                        ref={ref}
                    >
                        {message}
                    </label>
                </div>
                <Checkbox id={id} checked={checked} onChange={onChange} />
            </div>
            <TitleTooltip ref={ref}>{tooltipMessage}</TitleTooltip>
        </Fragment>
    );
};
