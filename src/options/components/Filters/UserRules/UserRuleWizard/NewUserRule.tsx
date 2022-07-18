import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { UserRuleWizardNewType } from 'Options/stores/OptionsStore';
import { Icon, IconId } from 'Common/components/ui';
import { theme } from 'Common/styles';
import { rootStore } from 'Options/stores';

import { NewUserRuleCustom } from './NewUserRuleCustom';
import { NewUserRuleUnblocking } from './NewUserRuleUnblocking';
import { NewUserRuleBlocking } from './NewUserRuleBlocking';

export const NewUserRule = observer(() => {
    const { optionsStore } = useContext(rootStore);

    const onSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        optionsStore.setUserRuleWizardNewType(e.target.value as UserRuleWizardNewType);
    };

    const wizardTypesMap = {
        [UserRuleWizardNewType.CUSTOM]: () => <NewUserRuleCustom />,
        [UserRuleWizardNewType.BLOCKING]: () => <NewUserRuleBlocking />,
        [UserRuleWizardNewType.UNBLOCKING]: () => <NewUserRuleUnblocking />,
    };

    const renderTypeComponent = wizardTypesMap[optionsStore.userRuleWizardNewType];

    return (
        <>
            <div className={theme.modal.title}>
                {translator.getMessage('options_user_rule_add_rule')}
            </div>
            <div className={theme.modal.itemWrapper}>
                <div className={theme.modal.label}>
                    {translator.getMessage('options_custom_filter_add_label_type')}
                </div>
                <div className={theme.modal.modalSelectContainer}>
                    <select
                        className={theme.modal.modalSelect}
                        onChange={onSelectionChange}
                        defaultValue={optionsStore.userRuleWizardNewType}
                    >
                        <option
                            value={UserRuleWizardNewType.CUSTOM}
                        >
                            {translator.getMessage('options_user_rule_wizard_custom')}
                        </option>
                        <option
                            value={UserRuleWizardNewType.BLOCKING}
                        >
                            {translator.getMessage('options_user_rule_wizard_blocking')}
                        </option>
                        <option
                            value={UserRuleWizardNewType.UNBLOCKING}
                        >
                            {translator.getMessage('options_user_rule_wizard_unblocking')}
                        </option>
                    </select>
                    <Icon id={IconId.CHEVRON_DOWN} className={theme.modal.modalSelectIcon} />
                </div>
            </div>
            {renderTypeComponent()}
        </>
    );
});
