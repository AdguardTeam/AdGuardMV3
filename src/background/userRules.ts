import { UserRuleType, NEW_LINE_SEPARATOR, NOTIFIER_EVENTS } from 'Common/constants/common';
import { USER_RULES_STORAGE_KEY, USER_RULES_LIMITS_STORAGE_KEY } from 'Common/constants/storage-keys';
import { log } from 'Common/logger';
import { UserRulesData, UserRulesProcessor } from 'Options/user-rules-processor';

import { notifier } from './notifier';
import { storage } from './storage';

export type UserRulesLimits = {
    declarativeRulesCount: number,
    regexpsCount: number
};

/**
 * Returns the "full" document allow rule for the specified site url
 */
const getDocumentAllowRuleForUrl = (siteUrl: string) => `@@||${siteUrl}^$document`;

class UserRules {
    private rules = '';

    private limits: UserRulesLimits | undefined;

    private userRulesProcessor: UserRulesProcessor | undefined;

    private setRules = async (rules: string) => {
        await this.saveRulesInStorage(rules);
        this.rules = rules;
        this.userRulesProcessor = new UserRulesProcessor(this.rules);
    };

    private saveRulesInStorage = async (rules: string) => {
        try {
            await storage.set(USER_RULES_STORAGE_KEY, rules);
        } catch (e: any) {
            log.error(e.message);
        }
    };

    private getFromStorage = async () => {
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

    getAllowlist = async () => {
        if (!this.userRulesProcessor) {
            return [];
        }

        const userRulesData = this.userRulesProcessor.getData();
        const allowlist = userRulesData.filter(
            (rule) => rule.type === UserRuleType.SITE_ALLOWED,
        );

        return allowlist;
    };

    setUserRules = async (userRules: string) => {
        await this.setRules(userRules);
    };

    addRule = async (ruleText: string) => {
        const newUserRules = this.rules
            ? `${this.rules}${NEW_LINE_SEPARATOR}${ruleText}`
            : ruleText;

        await this.setRules(newUserRules);
    };

    getSiteAllowRule = async (siteUrl: string): Promise<UserRulesData | undefined> => {
        const allowlist = await this.getAllowlist();
        const documentAllowRule = getDocumentAllowRuleForUrl(siteUrl);

        return allowlist.find(({ domain, ruleText }) => {
            return domain === siteUrl && ruleText === documentAllowRule;
        });
    };

    /**
     * Enables, creates or deletes allowlist rule for provided site url
     * @returns allowlisted site or not
     */
    toggleSiteAllowlistStatus = async (siteUrl: string): Promise<boolean> => {
        const allowRule = await this.getSiteAllowRule(siteUrl);

        let newUserRules = '';
        let isAllowlisted: boolean;

        if (allowRule) {
            const userRulesProcessor = new UserRulesProcessor(this.rules);

            const allowlisted = allowRule?.enabled || false;
            if (allowlisted) {
                userRulesProcessor.deleteRule(allowRule.id);
                isAllowlisted = false;
            } else {
                userRulesProcessor.enableRule(allowRule.id);
                isAllowlisted = true;
            }

            newUserRules = userRulesProcessor.getUserRules();
        } else {
            const newRule = getDocumentAllowRuleForUrl(siteUrl);
            newUserRules = this.rules.concat(NEW_LINE_SEPARATOR, newRule);
            isAllowlisted = true;
        }

        await this.setRules(newUserRules);
        // Notify UI and context-menu about changes
        notifier.notify(NOTIFIER_EVENTS.SET_RULES, { value: newUserRules });

        return isAllowlisted;
    };

    public async init() {
        const storedRules = await storage.get(USER_RULES_STORAGE_KEY) as string || this.rules;

        await this.setRules(storedRules);
    }
}

export const userRules = new UserRules();
