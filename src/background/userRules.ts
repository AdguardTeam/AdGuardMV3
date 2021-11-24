import _ from 'lodash';

import { NEW_LINE_SEPARATOR, NOTIFIER_EVENTS } from 'Common/constants';
import { log } from 'Common/logger';
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

    setUserRules(userRules: string) {
        this.rules = userRules;
        this.persist();
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
