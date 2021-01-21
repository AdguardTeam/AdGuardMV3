import React from 'react';
import cn from 'classnames';

type IconProps = {
    id: string,
    className?: string,
};

const Icon = ({
    id,
    className,
}: IconProps) => {
    return (
        <svg className={cn('icon', className)}>
            <use xlinkHref={`#${id}`} />
        </svg>
    );
};

Icon.defaultProps = {
    className: '',
};

export { Icon };
