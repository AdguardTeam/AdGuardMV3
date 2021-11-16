import _ from 'lodash';

import { log } from 'Common/logger';
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

    async init() {
        this.rules = await storage.get(this.STORAGE_KEY) || this.rules;
    }
}

export const userRules = new UserRules();
