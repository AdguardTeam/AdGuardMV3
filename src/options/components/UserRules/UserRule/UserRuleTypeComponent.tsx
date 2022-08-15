import React from 'react';
import cn from 'classnames';

import { translator } from 'Common/translators/translator';
import { UserRuleType } from 'Common/constants/common';

import styles from './UserRuleStatus.module.pcss';

type TypeProps = {
    message: string,
    classname?: string
};

const UserRuleTypeMap: Record<UserRuleType, TypeProps> = {
    [UserRuleType.SITE_ALLOWED]: {
        message: translator.getMessage('options_user_rule_status_website_allowed'),
        classname: styles.green,
    },
    [UserRuleType.SITE_BLOCKED]: {
        message: translator.getMessage('options_user_rule_status_website_blocked'),
        classname: styles.red,
    },
    [UserRuleType.ELEMENT_BLOCKED]: {
        message: translator.getMessage('options_user_rule_status_element_blocked'),
        classname: styles.red,
    },
    [UserRuleType.CUSTOM]: {
        message: translator.getMessage('options_user_rule_status_custom_rule'),
        classname: styles.yellow,
    },
};

type UserRulesTypeComponentProps = { type: UserRuleType };

export const UserRuleTypeComponent = ({ type }: UserRulesTypeComponentProps) => {
    const {
        message,
        classname,
    } = UserRuleTypeMap[type];

    return (
        <div className={cn(styles.status, classname)}>
            {message}
        </div>
    );
};
