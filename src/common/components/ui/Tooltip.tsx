/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { Icon } from 'Common/components/ui/Icon';
import styles from './Tooltip.module.pcss';

type IProps = { iconId: string, className?: string, children: JSX.Element, disabled: boolean };

const Tooltip = ({
    iconId, className, children, disabled,
}: IProps) => {
    const {
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: 'click', placement: 'bottom-start', interactive: true, defaultVisible: false,
    });

    /* TODO: close on option click */
    return (
        <>
            <button type="button" ref={setTriggerRef} className={className} disabled={disabled}>
                <Icon id={iconId} className="icon--button" />
            </button>
            {!disabled && visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: styles.tooltip })}
                >
                    {children}
                </div>
            )}
        </>
    );
};

Tooltip.defaultProps = {
    className: '',
};

export { Tooltip };
