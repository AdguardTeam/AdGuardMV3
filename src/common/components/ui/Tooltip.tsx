/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { Icon } from 'Common/components/ui/Icon';
import useOutsideClick from 'Common/hooks/useOutsideClick';
import { IconIdType } from 'Common/components/ui/Icons';
import styles from './Tooltip.module.pcss';

type IProps = {
    iconId: IconIdType,
    className?: string,
    children: React.ReactChild | React.ReactChild[],
    disabled: boolean,
};

const Tooltip = ({
    iconId,
    className,
    children,
    disabled,
}: IProps) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    const open = () => {
        setVisible(true);
    };

    const close = () => {
        setVisible(false);
    };

    useOutsideClick(ref, close);

    const {
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
    } = usePopperTooltip({
        trigger: null,
        placement: 'bottom-start',
    });

    return (
        <span ref={ref}>
            <button
                type="button"
                ref={setTriggerRef}
                className={className}
                disabled={disabled}
                onClick={open}
            >
                <Icon id={iconId} />
            </button>
            {!disabled && visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({
                        className: styles.tooltip,
                        onClick: close,
                    })}
                >
                    {children}
                </div>
            )}
        </span>
    );
};

Tooltip.defaultProps = {
    className: '',
};

export { Tooltip };
