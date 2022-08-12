import React, { useContext } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { rootStore } from 'Options/stores';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { useKeyPress } from 'Common/hooks/useKeyPress';
import { KEY_ENTER } from 'Common/constants/keyboard';
import { useNotifyDynamicRulesLimitsError } from 'Options/hooks/useNotifyDynamicRulesLimitError';

import { UserRuleEditor } from './UserRuleEditor';

export const NewUserRuleCustom = observer(() => {
    const { optionsStore } = useContext(rootStore);
    const { createdUserRuleText, error } = optionsStore;

    const checkAndNotifyDynamicRulesError = useNotifyDynamicRulesLimitsError();

    const onChange = (value: string) => {
        const rule = value.trim();
        optionsStore.updateCreatedUserRule(rule);
    };

    const addRule = async () => {
        const err = await optionsStore.addCreatedUserRule();
        checkAndNotifyDynamicRulesError(err);
    };

    useKeyPress(KEY_ENTER, () => addRule(), [createdUserRuleText]);

    return (
        <>
            <div className={theme.modal.itemWrapper}>
                <div className={theme.modal.label}>
                    {reactTranslator.getMessage('options_custom_filter_add_label_rule')}
                </div>
                <UserRuleEditor
                    ruleText={createdUserRuleText}
                    onChange={onChange}
                    mod="modal"
                />
                {error && (
                    <div className={theme.common.error}>
                        {error}
                    </div>
                )}
            </div>
            <div className={theme.modal.footer}>
                <button
                    disabled={!createdUserRuleText}
                    type="button"
                    onClick={addRule}
                    className={cn(theme.button.middle, theme.button.green)}
                >
                    {reactTranslator.getMessage('options_user_rule_wizard_button_add')}
                </button>
            </div>
        </>
    );
});
