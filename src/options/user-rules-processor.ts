/* eslint-disable class-methods-use-this */
import {
    CosmeticRule,
    IRule,
    NetworkRule,
    RuleFactory,
} from '@adguard/tsurlfilter';

import { UserRuleType, REGEX_DOMAIN_IN_RULE } from 'Common/constants/common';

export interface UserRulesData {
    id: number;
    ruleText: string;
    domain: string | null;
    enabled: boolean;
    type: UserRuleType,
}

export class UserRulesProcessor {
    NEW_LINE_SEPARATOR = '\n';

    DISABLE_MARKER = '!off!';

    userRules: string;

    userRulesData: UserRulesData[];

    constructor(userRules: string) {
        this.userRules = userRules;
        this.userRulesData = this.processUserRules(userRules);
    }

    getData() {
        return this.userRulesData;
    }

    getDomain(rule: IRule): string | null {
        const canCheckDomains = rule instanceof CosmeticRule || rule instanceof NetworkRule;
        if (!canCheckDomains) {
            return null;
        }

        const ruleText = rule.getText();
        const domainRules = ruleText.match(REGEX_DOMAIN_IN_RULE);

        const permittedDomains = rule.getPermittedDomains()
            ? rule.getPermittedDomains() : domainRules;

        if (!permittedDomains) {
            return null;
        }

        if (permittedDomains.length < 0 || permittedDomains.length > 1) {
            return null;
        }

        return permittedDomains[0];
    }

    getType(rule: IRule) {
        if (rule instanceof CosmeticRule && !rule.isAllowlist()) {
            return UserRuleType.ELEMENT_BLOCKED;
        }

        if (rule instanceof NetworkRule) {
            if (rule.isAllowlist()) {
                return UserRuleType.SITE_ALLOWED;
            }
            return UserRuleType.SITE_BLOCKED;
        }

        return UserRuleType.CUSTOM;
    }

    processUserRules(userRulesText: string): UserRulesData[] {
        const userRulesTexts = userRulesText.split(this.NEW_LINE_SEPARATOR);

        return userRulesTexts.map((rawUserRuleText, index) => {
            let userRuleText = rawUserRuleText;
            let isRuleEnabled = true;

            if (userRuleText.startsWith(this.DISABLE_MARKER)) {
                isRuleEnabled = false;
                userRuleText = rawUserRuleText.slice(this.DISABLE_MARKER.length);
            }

            const rule = RuleFactory.createRule(userRuleText, 0);
            if (!rule) {
                return null;
            }

            const domain = this.getDomain(rule);

            const type = this.getType(rule);

            return {
                id: index,
                ruleText: userRuleText,
                domain,
                enabled: isRuleEnabled,
                type,
            };
        }).filter(<(d: UserRulesData | null) => d is UserRulesData>((data) => data !== null));
    }

    enableRule(ruleId: number) {
        const userRulesStrings = this.userRules.split(this.NEW_LINE_SEPARATOR);
        const targetRuleString = userRulesStrings[ruleId];
        if (!targetRuleString) {
            return false;
        }

        if (targetRuleString.startsWith(this.DISABLE_MARKER)) {
            const enabledRuleString = targetRuleString.slice(this.DISABLE_MARKER.length);
            userRulesStrings[ruleId] = enabledRuleString;
            this.userRules = userRulesStrings.join(this.NEW_LINE_SEPARATOR);
            this.userRulesData = this.processUserRules(this.userRules);
            return true;
        }

        return false;
    }

    disableRule(ruleId: number) {
        const userRulesStrings = this.userRules.split(this.NEW_LINE_SEPARATOR);
        const targetRuleString = userRulesStrings[ruleId];
        if (!targetRuleString) {
            return false;
        }

        if (targetRuleString.startsWith(this.DISABLE_MARKER)) {
            return false;
        }

        const disabledRuleString = `${this.DISABLE_MARKER}${targetRuleString}`;
        userRulesStrings[ruleId] = disabledRuleString;
        this.userRules = userRulesStrings.join(this.NEW_LINE_SEPARATOR);
        this.userRulesData = this.processUserRules(this.userRules);

        return true;
    }

    getUserRules() {
        return this.userRules;
    }

    updateRule(ruleId: number, ruleText: string) {
        const userRulesStrings = this.userRules.split(this.NEW_LINE_SEPARATOR);
        const targetRuleString = userRulesStrings[ruleId];
        if (!targetRuleString) {
            return false;
        }
        let newRule;
        if (targetRuleString.startsWith(this.DISABLE_MARKER)) {
            newRule = `${this.DISABLE_MARKER}${ruleText}`;
        } else {
            newRule = ruleText;
        }
        userRulesStrings[ruleId] = newRule;
        this.userRules = userRulesStrings.join(this.NEW_LINE_SEPARATOR);
        this.userRulesData = this.processUserRules(this.userRules);
        return true;
    }

    deleteRule(ruleId: number) {
        const userRulesStrings = this.userRules.split(this.NEW_LINE_SEPARATOR);
        const targetRuleString = userRulesStrings[ruleId];
        if (!targetRuleString) {
            return false;
        }

        userRulesStrings.splice(ruleId, 1);

        this.userRules = userRulesStrings.join(this.NEW_LINE_SEPARATOR);
        this.userRulesData = this.processUserRules(this.userRules);
        return true;
    }
}
