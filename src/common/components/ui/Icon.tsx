import React from 'react';
import cn from 'classnames';
import { ICON_ID_CLASS_MAP, ICON_ID } from './Icons';

type IconProps = {
    id: ICON_ID,
    className?: string,
};

/* Import Icons before to use this component */
const Icon = ({
    id,
    className,
}: IconProps) => {
    return (
        <svg className={cn(ICON_ID_CLASS_MAP[id], className)}>
            <use xlinkHref={`#${id}`} />
        </svg>
    );
};

Icon.defaultProps = {
    className: '',
};

export { Icon };
