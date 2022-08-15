import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from 'Options/stores';
import { Modal } from 'Common/components/Modal';
import { UserRuleWizardAction } from 'Options/stores/OptionsStore';
import { EditUserRule } from 'Options/components/UserRules/UserRuleWizard/EditUserRule';
import { NewUserRule } from 'Options/components/UserRules/UserRuleWizard/NewUserRule';

export const UserRuleWizard = observer(() => {
    const { optionsStore } = useContext(rootStore);

    if (!optionsStore.userRuleWizardOpen) {
        return null;
    }

    const handleClose = () => {
        optionsStore.closeUserRuleWizard();
    };

    const actionsMap = {
        [UserRuleWizardAction.NEW]: () => <NewUserRule />,
        [UserRuleWizardAction.EDIT]: () => <EditUserRule />,
    };

    const actionComponent = actionsMap[optionsStore.userRuleWizardAction];

    return (
        <Modal
            isOpen={optionsStore.userRuleWizardOpen}
            handleClose={handleClose}
        >
            {actionComponent()}
        </Modal>
    );
});
