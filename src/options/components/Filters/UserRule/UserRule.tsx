import React, { Fragment } from 'react';
import { UserRuleStatus } from 'Options/components/Filters/UserRule/UserRuleStatus';
import { UserRuleType } from 'Options/stores/OptionsStore';
import styles from 'Options/components/Filters/UserRule/UserRule.module.pcss';

type IProps = Omit<UserRuleType, 'domain'> & { onClick: (e: React.MouseEvent) => void };

export const UserRule = ({
    rule,
    status,
    onClick,
}: IProps) => (
    <Fragment key={rule}>
        <div className={styles.checkboxContainer}>
            <span className={`${styles.container} ${styles.rule}`}>
                <input type="checkbox" id={rule} />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label className={styles.checkmark} htmlFor={rule} />
                <button type="button" onClick={onClick} className={styles.ruleButton}>{rule}</button>
            </span>
        </div>
        <UserRuleStatus status={status} />
    </Fragment>
);
