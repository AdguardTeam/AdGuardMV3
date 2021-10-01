import React from 'react';
import cn from 'classnames';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { USER_RULE_STATUS } from 'Options/stores/OptionsStore';

import styles from 'Options/components/Filters/UserRule/UserRuleStatus.module.pcss';

type StatusProps = {
    i18nKey: string,
    statusClass?: string
};

const statusProps: Record<USER_RULE_STATUS, StatusProps> = {
    [USER_RULE_STATUS.SITE_ALLOWED]: {
        i18nKey: 'options_user_rule_status_website_allowed',
        statusClass: styles.green,
    },
    [USER_RULE_STATUS.SITE_BLOCKED]: {
        i18nKey: 'options_user_rule_status_website_blocked',
        statusClass: styles.red,
    },
    [USER_RULE_STATUS.ELEMENT_BLOCKED]: {
        i18nKey: 'options_user_rule_status_element_blocked',
        statusClass: styles.red,
    },
    [USER_RULE_STATUS.CUSTOM]: {
        i18nKey: 'options_user_rule_status_custom_rule',
        statusClass: styles.yellow,
    },
};

type IProps = { status: USER_RULE_STATUS };

export const UserRuleStatus = ({ status }: IProps) => {
    const { i18nKey, statusClass } = statusProps[status];

    return (
        <div className={cn(styles.status, statusClass)}>
            {reactTranslator.getMessage(i18nKey)}
        </div>
    );
};
