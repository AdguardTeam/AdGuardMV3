import React from 'react';
import cn from 'classnames';

import './tooltip.pcss';

export const Tooltip = ({ text, className }: TooltipType) => {
    return (
        <div className={cn('tooltip', className)}>
            {text}
        </div>
    );
};

type TooltipType = {
    text: string,
    className?: string,
};

Tooltip.defaultProps = {
    className: '',
};
