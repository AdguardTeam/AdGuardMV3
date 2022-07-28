import { UserRuleType, NEW_LINE_SEPARATOR } from 'Common/constants/common';
import { USER_RULES_STORAGE_KEY, USER_RULES_LIMITS_STORAGE_KEY } from 'Common/constants/storage-keys';
import { log } from 'Common/logger';
import { UserRulesProcessor } from 'Options/user-rules-processor';

import { storage } from './storage';

export type UserRulesLimits = {
    declarativeRulesCount: number,
    regexpsCount: number
};

class UserRules {
    private rules = '';

    private limits: UserRulesLimits | undefined;

    private setRules = async (rules: string) => {
        await this.saveRulesInStorage(rules);
        this.rules = rules;
    };

    private saveRulesInStorage = async (rules: string) => {
        try {
            await storage.set(USER_RULES_STORAGE_KEY, rules);
        } catch (e: any) {
            log.error(e.message);
        }
    };

    getFromStorage = async () => {
        const rules = await storage.get(USER_RULES_STORAGE_KEY) as string;
        return rules ?? this.rules;
    };

    getRules = async () => {
        if (this.rules) {
            return this.rules;
        }
        this.rules = await this.getFromStorage();
        return this.rules;
    };

    setUserRulesCounters = async (limits: UserRulesLimits) => {
        await storage.set(USER_RULES_LIMITS_STORAGE_KEY, limits);
        this.limits = limits;
    };

    getUserRulesCounters = async (): Promise<UserRulesLimits> => {
        if (!this.limits) {
            this.limits = await storage.get<UserRulesLimits>(USER_RULES_LIMITS_STORAGE_KEY);
        }

        return this.limits || {
            declarativeRulesCount: 0,
            regexpsCount: 0,
        };
    };

    getAllowlist() {
        const userRulesProcessor = new UserRulesProcessor(this.rules);
        const userRulesData = userRulesProcessor.getData();
        const allowlist = userRulesData.filter(
            (rule) => rule.type === UserRuleType.SITE_ALLOWED,
        );

        return allowlist;
    }

    getCurrentAllowRule(domainName: string) {
        const allowlist = this.getAllowlist();

        const currentAllowRule = allowlist.find(
            (rule) => rule.domain === domainName,
        );

        return currentAllowRule;
    }

    setUserRules = async (userRules: string) => {
        await this.setRules(userRules);
    };

    addRule = async (ruleText: string) => {
        const newUserRules = this.rules
            ? `${this.rules}${NEW_LINE_SEPARATOR}${ruleText}`
            : ruleText;

        await this.setRules(newUserRules);
    };

    public async init() {
        const storedRules = await storage.get(USER_RULES_STORAGE_KEY) as string || this.rules;

        await this.setRules(storedRules);
    }
}

export const userRules = new UserRules();
