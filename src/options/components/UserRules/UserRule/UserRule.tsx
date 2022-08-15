import React, { useContext } from 'react';
import cn from 'classnames';

import { UserRuleTypeComponent } from 'Options/components/UserRules/UserRule/UserRuleTypeComponent';
import { UserRuleType } from 'Common/constants/common';
import { rootStore } from 'Options/stores';
import { useNotifyDynamicRulesLimitsError } from 'Options/hooks/useNotifyDynamicRulesLimitError';
import { theme } from 'Common/styles';

import { HighlightSearch } from '../../HighlightSearch';

import styles from './UserRule.module.pcss';

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

    const checkAndNotifyDynamicRulesError = useNotifyDynamicRulesLimitsError();

    const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = e;

        const ruleId = Number(target.id);

        let error;
        if (target.checked) {
            error = await optionsStore.enableRule(ruleId);
        } else {
            error = await optionsStore.disableRule(ruleId);
        }

        checkAndNotifyDynamicRulesError(error);
    };

    const handleRuleClick = () => {
        optionsStore.openEditUserRuleWizard({ id, ruleText });
    };

    return (
        <>
            <div className={styles.checkboxContainer}>
                <span className={cn(theme.checkbox.container, styles.rule)}>
                    <input type="checkbox" id={String(id)} checked={enabled} onChange={handleToggle} />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label className={theme.checkbox.checkmark} htmlFor={String(id)} />
                    <button type="button" onClick={handleRuleClick} className={styles.ruleButton}>
                        <HighlightSearch str={ruleText} />
                    </button>
                </span>
            </div>
            <UserRuleTypeComponent type={type} />
        </>
    );
};
