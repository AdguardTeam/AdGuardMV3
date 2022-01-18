import React, { useContext } from 'react';

import { UserRuleTypeComponent } from 'Options/components/Filters/UserRules/UserRule/UserRuleTypeComponent';
import { UserRuleType } from 'Common/constants';

import styles from 'Options/components/Filters/UserRules/UserRule/UserRule.module.pcss';
import { rootStore } from 'Options/stores';

interface UserRuleProps {
    id: number;
    ruleText: string;
    enabled: boolean;
    type: UserRuleType;
}

export const UserRule = ({
    id,
    enabled,
    ruleText,
    type,

}: UserRuleProps) => {
    const { optionsStore } = useContext(rootStore);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = e;

        const ruleId = Number(target.id);

        if (target.checked) {
            optionsStore.enableRule(ruleId);
        } else {
            optionsStore.disableRule(ruleId);
        }
    };

    const handleRuleClick = () => {
        optionsStore.openEditUserRuleWizard({ id, ruleText });
    };

    return (
        <>
            <div className={styles.checkboxContainer}>
                <span className={`${styles.container} ${styles.rule}`}>
                    <input type="checkbox" id={String(id)} checked={enabled} onChange={handleToggle} />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className={styles.checkmark} htmlFor={String(id)} />
                    <button type="button" onClick={handleRuleClick} className={styles.ruleButton}>{ruleText}</button>
                </span>
            </div>
            <UserRuleTypeComponent type={type} />
        </>
    );
};
