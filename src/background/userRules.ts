import _ from 'lodash';

import { NEW_LINE_SEPARATOR, NOTIFIER_EVENTS, UserRuleType } from 'Common/constants';
import { log } from 'Common/logger';
import { UserRulesProcessor } from 'Options/user-rules-processor';
import { notifier } from './notifier';
import { storage } from './storage';

class UserRules {
    // TODO remove sample rules
    rules = `example.org##h1
@@||adguard.com^
||baddomain.com^$domain=google.com
!off!@@||gooddomain.com^$domain=google.com
`;

    STORAGE_KEY = 'user_rules';

    THROTTLE_TIMEOUT_MS = 1000;

    persist = _.throttle(async () => {
        try {
            await storage.set(this.STORAGE_KEY, this.rules);
        } catch (e: any) {
            log.error(e.message);
        }
    }, this.THROTTLE_TIMEOUT_MS);

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

    setUserRules(userRules: string) {
        this.rules = userRules;
        this.persist();
        notifier.notify(NOTIFIER_EVENTS.SET_RULES, this.rules);
    }

    addRules = (rulesText: string) => {
        notifier.notify(NOTIFIER_EVENTS.ADD_RULES, rulesText);
        const newUserRules = `${this.rules}${NEW_LINE_SEPARATOR}${rulesText}`;
        this.rules = newUserRules;
    };

    async init() {
        this.rules = await storage.get(this.STORAGE_KEY) || this.rules;
    }
}

export const userRules = new UserRules();
