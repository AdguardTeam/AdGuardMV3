/* eslint-disable react/jsx-props-no-spreading */
import React, {
    forwardRef,
    useEffect,
    ReactNode,
    ForwardedRef,
    MutableRefObject,
} from 'react';
import cn from 'classnames';
import { usePopperTooltip } from 'react-popper-tooltip';
import { TriggerType } from 'react-popper-tooltip/dist/types';

import styles from 'Common/components/TitleTooltip/TitleTooltip.module.pcss';

type TitleTooltipProps = {
    className?: string,
    children: ReactNode,
    trigger?: TriggerType,
};

// FIXME use one tooltip for the whole page using context
const TitleTooltip = forwardRef<HTMLElement, TitleTooltipProps>(({
    className,
    children,
    trigger,
}: TitleTooltipProps,
ref: ForwardedRef<HTMLElement>) => {
    const {
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger,
    });

    useEffect(() => {
        setTriggerRef((ref as MutableRefObject<HTMLElement>)?.current);
        return () => setTriggerRef(null);
    }, []);

    return (
        <div>
            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: cn(styles.container, className) })}
                >
                    {children}
                </div>
            )}
        </div>
    );
});

TitleTooltip.defaultProps = {
    className: '',
    trigger: 'hover',
};

export { TitleTooltip };
