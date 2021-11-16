import { observer } from 'mobx-react';
import React from 'react';

import { UserRulesGroup } from 'Options/components/Filters/UserRules/UserRulesGroup';
import { useStore } from 'Options/stores/useStore';

export const UserRulesGroups = observer(() => {
    const { optionsStore } = useStore();

    return (
        <>
            {optionsStore.userRulesGroups.map((userRulesGroup) => {
                const [domain, userRules] = userRulesGroup;
                return (
                    <UserRulesGroup
                        key={domain}
                        domain={domain}
                        userRules={userRules}
                    />
                );
            })}
        </>
    );
});
