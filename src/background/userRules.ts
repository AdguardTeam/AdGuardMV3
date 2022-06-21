import {
    USER_RULES_STORAGE_KEY,
    NEW_LINE_SEPARATOR,
    UserRuleType,
} from 'Common/constants';
import { log } from 'Common/logger';
import { UserRulesProcessor } from 'Options/user-rules-processor';
import { storage } from './storage';

class UserRules {
    rules = '';

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
