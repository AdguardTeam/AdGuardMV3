import React from 'react';
import cn from 'classnames';

import { ICON_ID_CLASS_MAP, IconId } from './Icons';

type IconProps = {
    id: IconId,
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
