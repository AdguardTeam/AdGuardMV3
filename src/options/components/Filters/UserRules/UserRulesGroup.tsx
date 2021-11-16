import React from 'react';

import styles from 'Options/components/Filters/UserRules/UserRules.module.pcss';
import { UserRulesData } from 'Options/user-rules-processor';
import { UserRule } from 'Options/components/Filters/UserRules/UserRule';
import { OTHER_DOMAIN_TITLE } from 'Options/constants';
import { translator } from 'Common/translators/translator';

interface UserRulesGroupProps {
    domain: string;
    userRules: UserRulesData[];
}

const getTitle = (domain: string) => {
    if (domain === OTHER_DOMAIN_TITLE) {
        return translator.getMessage('options_user_rules_other_domain');
    }
    return domain;
};

export const UserRulesGroup = ({ domain, userRules }: UserRulesGroupProps) => {
    const title = getTitle(domain);

    return (
        <div key={domain} className={styles.domainGroup}>
            <div className={styles.domain}>{title}</div>
            {userRules.map(((userRule) => {
                return (
                    <UserRule
                        key={userRule.id}
                        id={userRule.id}
                        ruleText={userRule.ruleText}
                        enabled={userRule.enabled}
                        type={userRule.type}
                    />
                );
            }))}
        </div>
    );
};
