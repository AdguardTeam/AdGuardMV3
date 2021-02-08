/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { Icon } from 'Common/components/ui/Icon';
import styles from './Tooltip.module.pcss';

type IProps = { iconId: string, className?: string, children: JSX.Element };

const Tooltip = ({ iconId, className, children }: IProps) => {
    const {
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({ trigger: 'click', placement: 'bottom-start' });

    return (
        <div className="App">
            <button type="button" ref={setTriggerRef} className={className}>
                <Icon id={iconId} className="icon--button iconCrumbs" />
            </button>
            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: styles.tooltip })}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

Tooltip.defaultProps = {
    className: '',
};

export { Tooltip };
