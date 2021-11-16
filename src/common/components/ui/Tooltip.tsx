/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { Icon, IconId } from 'Common/components/ui';
import { useOutsideClick } from 'Common/hooks/useOutsideClick';
import styles from './Tooltip.module.pcss';

type IProps = {
    iconId: IconId,
    className?: string,
    children: React.ReactChild | React.ReactChild[],
    enabled?: boolean,
};

const Tooltip = ({
    iconId,
    className,
    children,
    enabled,
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
                disabled={!enabled}
                onClick={open}
            >
                <Icon id={iconId} />
            </button>
            {visible && (
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
    enabled: true,
};

export { Tooltip };
