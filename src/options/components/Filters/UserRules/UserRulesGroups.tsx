import { observer } from 'mobx-react';
import React from 'react';

import { UserRulesGroup } from 'Options/components/Filters/UserRules/UserRulesGroup';
import { useStore } from 'Options/stores/useStore';
import { translator } from 'Common/translators/translator';

import styles from '../Filters.module.pcss';

export const UserRulesGroups = observer(() => {
    const { optionsStore: { userRulesGroups } } = useStore();

    return (
        <>
            {userRulesGroups.length > 0 ? (
                userRulesGroups.map((userRulesGroup) => {
                    const [domain, userRules] = userRulesGroup;
                    return (
                        <UserRulesGroup
                            key={domain}
                            domain={domain}
                            userRules={userRules}
                        />
                    );
                })
            ) : (
                <div className={styles.notFound}>{translator.getMessage('options_filters_not_rules')}</div>
            )}
        </>
    );
});