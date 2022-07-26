import React, { useState, useEffect, useRef } from 'react';

import { AttachmentPortal } from '../../AttachmentPortal';
import { Tooltip } from '../Tooltip';

const TOOLTIP_SHOW_DELAY_MS = 1000;

type PopoverProps = {
    text: string,
    delay?: number,
    children: JSX.Element,
    className?: string,
};

/**
 * Wrap child container for handle tooltips rendering in overlay on hover
 */
export const Popover = ({
    text,
    delay,
    children,
    className,
}: PopoverProps) => {
    const [tooltip, setTooltip] = useState({
        visible: false,
        position: {
            x: 0,
            y: 0,
        },
    });

    const timer: { current: NodeJS.Timeout | null } = useRef(null);

    // clear timer on unmounting
    useEffect(() => {
        return () => {
            clearTimeout(timer.current as NodeJS.Timeout);
        };
    }, []);

    const handleMouseEnter = (e: React.MouseEvent) => {
        timer.current = setTimeout(() => {
            setTooltip({
                visible: true,
                position: {
                    x: e.clientX + 20,
                    y: e.clientY + 20,
                },
            });
        }, delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timer.current as NodeJS.Timeout);
        setTooltip({
            visible: false,
            position: { x: 0, y: 0 },
        });
    };

    return (
        <div
            className="popover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {tooltip.visible && (
                <AttachmentPortal rootId="root-portal" position={tooltip.position}>
                    <Tooltip text={text} className={className} />
                </AttachmentPortal>
            )}
            {children}
        </div>
    );
};

Popover.defaultProps = {
    delay: TOOLTIP_SHOW_DELAY_MS,
    className: '',
};
