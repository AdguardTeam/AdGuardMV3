import {
    USER_RULES_STORAGE_KEY,
    NEW_LINE_SEPARATOR,
    NOTIFIER_EVENTS,
    UserRuleType,
} from 'Common/constants';
import { log } from 'Common/logger';
import { UserRulesProcessor } from 'Options/user-rules-processor';
import { notifier } from './notifier';
import { storage } from './storage';
import { dynamicRules } from './dynamic-rules';
import { engine } from './engine';

class UserRules {
    rules = '';

    private setRules = async (rules: string) => {
        await dynamicRules.setRules(rules);
        await this.saveRulesInStorage(rules);

        this.rules = rules;
        await engine.init(true);
    };

    private saveRulesInStorage = async (rules: string) => {
        try {
            await storage.set(USER_RULES_STORAGE_KEY, rules);
        } catch (e: any) {
            log.error(e.message);
        }
    };

    getRules() {
        return this.rules;
    }

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

        notifier.notify(NOTIFIER_EVENTS.SET_RULES, this.rules);
    };

    addRule = async (ruleText: string) => {
        const newUserRules = `${this.rules}${NEW_LINE_SEPARATOR}${ruleText}`;

        await this.setRules(newUserRules);

        notifier.notify(NOTIFIER_EVENTS.ADD_RULES, this.rules);
    };

    public async init() {
        const storedRules = await storage.get(USER_RULES_STORAGE_KEY) as string || this.rules;

        await this.setRules(storedRules);
    }
}

export const userRules = new UserRules();
