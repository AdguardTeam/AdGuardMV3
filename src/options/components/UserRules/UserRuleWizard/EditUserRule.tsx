import React, { useContext } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { UserRuleEditor } from 'Options/components/UserRules/UserRuleWizard/UserRuleEditor';
import { rootStore } from 'Options/stores';
import { useNotifyDynamicRulesLimitsError } from 'Options/hooks/useNotifyDynamicRulesLimitError';
import { theme } from 'Common/styles';

export const EditUserRule = observer(() => {
    const { optionsStore } = useContext(rootStore);

    const checkAndNotifyDynamicRulesError = useNotifyDynamicRulesLimitsError();

    if (optionsStore.userRuleInWizard === null) {
        throw new Error('userRuleInWizard is required');
    }

    const onChange = (value: string) => {
        optionsStore.updateUserRuleInWizard(value);
    };

    const onDeleteClick = async () => {
        const err = await optionsStore.deleteUserRuleInWizard();
        checkAndNotifyDynamicRulesError(err);
    };

    // TODO add some validation
    const onSaveClick = async () => {
        const err = await optionsStore.saveUserRuleInWizard();
        checkAndNotifyDynamicRulesError(err);
    };

    return (
        <>
            <div className={theme.modal.title}>
                {reactTranslator.getMessage('options_user_rule_edit_rule')}
            </div>
            <div className={theme.modal.itemWrapper}>
                <div className={theme.modal.label}>
                    {reactTranslator.getMessage('options_custom_filter_add_label_rule')}
                </div>
                <UserRuleEditor
                    ruleText={optionsStore.userRuleInWizard.ruleText}
                    onChange={onChange}
                    mod="modal"
                />
            </div>
            <div className={theme.modal.footer}>
                <button
                    type="button"
                    className={cn(theme.button.middle, theme.button.green, theme.modal.leftBtn)}
                    onClick={onSaveClick}
                >
                    {reactTranslator.getMessage('options_user_rule_save')}
                </button>
                <button
                    type="button"
                    className={cn(theme.button.middle, theme.button.red)}
                    onClick={onDeleteClick}
                >
                    {reactTranslator.getMessage('options_user_rule_delete')}
                </button>
            </div>
        </>
    );
});
