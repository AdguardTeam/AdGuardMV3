import React, { ReactNode } from 'react';
import cn from 'classnames';

import { theme } from 'Common/styles';

import styles from './Section.module.pcss';

interface SectionProps {
    children: ReactNode,
    header? : ReactNode,
    title?: string,
}

export const Section = ({ children, title, header }: SectionProps) => {
    return (
        <>
            {title ? (
                <h1 className={cn(styles.title, theme.common.headingMain)}>
                    {title}
                </h1>
            ) : header}
            <div className={styles.container}>
                {children}
            </div>
        </>
    );
};

Section.defaultProps = {
    header: undefined,
    title: undefined,
};
