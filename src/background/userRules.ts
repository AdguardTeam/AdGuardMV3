import { UserRuleType, NEW_LINE_SEPARATOR } from 'Common/constants/common';
import { USER_RULES_STORAGE_KEY, USER_RULES_STATUS_STORAGE_KEY } from 'Common/constants/storage-keys';
import { log } from 'Common/logger';
import { UserRulesData, UserRulesProcessor } from 'Options/user-rules-processor';

import { storage } from './storage';

type RulesStatus = {
    enabledCount: number,
    totalCount: number,
    maximumCount: number,
    limitExceed: boolean,
    excludedRulesIds: number[],
};

export type UserRulesStatus = {
    rules: RulesStatus,
    regexpsRules: RulesStatus
};

/**
 * Returns the "full" document allow rule for the specified site url
 */
const getDocumentAllowRuleForUrl = (siteUrl: string) => `@@||${siteUrl}^$document`;

class UserRules {
    private rules = '';

    private status: UserRulesStatus = {
        rules: {
            enabledCount: 0,
            totalCount: 0,
            maximumCount: 0,
            limitExceed: false,
            excludedRulesIds: [],
        },
        regexpsRules: {
            enabledCount: 0,
            totalCount: 0,
            maximumCount: 0,
            limitExceed: false,
            excludedRulesIds: [],
        },
    };

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
            log.error('Cannot save user rules to storage: ', e.message);
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

    setUserRulesStatus = async (status: UserRulesStatus) => {
        await storage.set(USER_RULES_STATUS_STORAGE_KEY, status);
        this.status = status;
    };

    getUserRulesStatus = (): UserRulesStatus => {
        return this.status;
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
        const existingAllowRule = await this.getSiteAllowRule(siteUrl);

        let newUserRules = '';
        let isAllowlisted: boolean;

        if (existingAllowRule) {
            const userRulesProcessor = new UserRulesProcessor(this.rules);

            const allowlisted = existingAllowRule?.enabled || false;
            if (allowlisted) {
                userRulesProcessor.deleteRule(existingAllowRule.id);
                isAllowlisted = false;
            } else {
                userRulesProcessor.enableRule(existingAllowRule.id);
                isAllowlisted = true;
            }

            newUserRules = userRulesProcessor.getUserRules();
        } else {
            const newRule = getDocumentAllowRuleForUrl(siteUrl);
            newUserRules = this.rules.concat(NEW_LINE_SEPARATOR, newRule);
            isAllowlisted = true;
        }

        await this.setRules(newUserRules);

        return isAllowlisted;
    };

    public async init() {
        const storedRules = await storage.get<string>(USER_RULES_STORAGE_KEY) || this.rules;
        await this.setRules(storedRules);

        const savedStatus = await storage.get<UserRulesStatus>(USER_RULES_STATUS_STORAGE_KEY);
        if (savedStatus) {
            this.status = savedStatus;
        }
    }
}

export const userRules = new UserRules();
