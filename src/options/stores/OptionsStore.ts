import {
    action,
    observable,
    makeObservable, computed,
} from 'mobx';

import type { RootStore } from './RootStore';

export enum USER_RULE_STATUS {
    SITE_BLOCKED = 'SITE_BLOCKED',
    ELEMENT_BLOCKED = 'ELEMENT_BLOCKED',
    SITE_ALLOWED = 'SITE_ALLOWED',
    CUSTOM = 'CUSTOM',
}

const domainRegexp = /(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})/;

const parseDomainFromRule = (rule: string) => {
    const matchArr = rule.match(domainRegexp);
    return matchArr ? matchArr[0] : rule;
};

const parseStatusFromRule = (rule: string): USER_RULE_STATUS => {
    if (rule.startsWith('||')) {
        return USER_RULE_STATUS.SITE_BLOCKED;
    }
    if (rule.startsWith('@@')) {
        return USER_RULE_STATUS.SITE_ALLOWED;
    }
    return USER_RULE_STATUS.CUSTOM;
};

const parseUserRule = (rule: string) => ({
    rule,
    domain: parseDomainFromRule(rule),
    status: parseStatusFromRule(rule),
});

export type UserRuleType = {
    domain: string,
    rule: string,
    status: USER_RULE_STATUS,
};

export class OptionsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    defaultRuleInputType = USER_RULE_STATUS.CUSTOM;

    defaultUserRules = [
        {
            domain: 'facebook.com',
            rule: '||baddomain.com^$domain=facebook',
            status: USER_RULE_STATUS.SITE_BLOCKED,
        },
        {
            domain: 'google.com',
            rule: 'example.org##.banner/google.com',
            status: USER_RULE_STATUS.ELEMENT_BLOCKED,
        },
        {
            domain: 'adguard.com',
            rule: '@@|adguard.com',
            status: USER_RULE_STATUS.SITE_ALLOWED,
        },
        {
            domain: 'google.com',
            rule: 'google.com',
            status: USER_RULE_STATUS.CUSTOM,
        },
    ];

    defaultRawUserRules = this.defaultUserRules.map(({ rule }) => {
        return rule;
    });

    defaultUserRuleInput = '';

    @observable
    ruleInputType = this.defaultRuleInputType;

    @computed
    get RULE_INPUT_TYPE() {
        // Only one value should be true
        return ({
            IS_SITE_BLOCKED: USER_RULE_STATUS.SITE_BLOCKED === this.ruleInputType,
            IS_SITE_ALLOWED: USER_RULE_STATUS.SITE_ALLOWED === this.ruleInputType,
            IS_ELEMENT_BLOCKED: USER_RULE_STATUS.ELEMENT_BLOCKED === this.ruleInputType,
            IS_CUSTOM: USER_RULE_STATUS.CUSTOM === this.ruleInputType,
        });
    }

    // FIXME group by domain
    @observable
    rawUserRules: string[] = this.defaultRawUserRules;

    @action
    setRawUserRules = (rawUserRules: string[]) => {
        this.rawUserRules = rawUserRules;
    };

    @computed
    get parsedUserRules(): UserRuleType[] {
        return this.rawUserRules.map(parseUserRule);
    }

    @observable
    userRuleInput = this.defaultUserRuleInput;

    @action
    setRuleInputType = (value: USER_RULE_STATUS) => {
        this.ruleInputType = value;
    };

    @action
    resetRuleInputType = () => {
        this.ruleInputType = this.defaultRuleInputType;
    };

    @action
    addRawUserRule = (rawUserRule: string) => {
        this.rawUserRules.push(rawUserRule);
    };

    @action
    updateUserRuleInput = (userRuleInput: string) => {
        this.userRuleInput = userRuleInput;
    };

    @action
    resetUserRuleInput = () => {
        this.updateUserRuleInput(this.defaultUserRuleInput);
    };
}
