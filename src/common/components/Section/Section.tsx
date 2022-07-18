import React, { ReactNode } from 'react';

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
                <h1 className={styles.title}>
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
