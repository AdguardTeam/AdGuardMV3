import React, { useContext } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { rootStore } from 'Options/stores';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';

import { UserRuleEditor } from './UserRuleEditor';

export const NewUserRuleCustom = observer(() => {
    const { optionsStore } = useContext(rootStore);

    const onChange = (value: string) => {
        optionsStore.updateCreatedUserRule(value);
    };

    const addRule = () => {
        optionsStore.addCreatedUserRule();
        optionsStore.closeUserRuleWizard();
    };

    return (
        <>
            <UserRuleEditor
                ruleText={optionsStore.createdUserRuleText}
                onChange={onChange}
            />
            <div className={theme.modal.footer}>
                <button
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
