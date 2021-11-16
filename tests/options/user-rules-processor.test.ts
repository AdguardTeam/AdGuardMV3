import { UserRulesProcessor } from 'Options/user-rules-processor';
import { UserRuleType } from 'Options/stores/OptionsStore';

describe('user rules processor', () => {
    it('processes user rules', () => {
        const userRulesString = `example.org##h1
@@||google.com$domain=adguard.com
||google.com^$domain=baddomain.com
||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);
        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.org##h1',
                domain: 'example.org',
                enabled: true,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
            {
                id: 1,
                ruleText: '@@||google.com$domain=adguard.com',
                domain: 'adguard.com',
                enabled: true,
                type: UserRuleType.SITE_ALLOWED,
            },
            {
                id: 2,
                ruleText: '||google.com^$domain=baddomain.com',
                domain: 'baddomain.com',
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 3,
                ruleText: '||google.com^',
                domain: null,
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
        ]);
    });
    it('ignores comments', () => {
        const userRulesString = `example.org##h1
!@@||google.com$domain=adguard.com
!||google.com^$domain=baddomain.com
!||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);
        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.org##h1',
                domain: 'example.org',
                enabled: true,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
        ]);
    });

    it('detects enabled and disabled rules', () => {
        const userRulesString = `example.org##h1
@@||google.com$domain=adguard.com
||google.com^$domain=baddomain.com
!off!||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);
        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.org##h1',
                domain: 'example.org',
                enabled: true,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
            {
                id: 1,
                ruleText: '@@||google.com$domain=adguard.com',
                domain: 'adguard.com',
                enabled: true,
                type: UserRuleType.SITE_ALLOWED,
            },
            {
                id: 2,
                ruleText: '||google.com^$domain=baddomain.com',
                domain: 'baddomain.com',
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 3,
                ruleText: '||google.com^',
                domain: null,
                enabled: false,
                type: UserRuleType.SITE_BLOCKED,
            },
        ]);
    });

    it('enables rules', () => {
        const userRulesString = `!off!example.org##h1
@@||google.com$domain=adguard.com
!off!||google.com^$domain=baddomain.com
!off!||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);

        userRulesProcessor.enableRule(0);
        userRulesProcessor.enableRule(3);
        // enabling non-existing rule doesn't affect anything
        userRulesProcessor.enableRule(6);
        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.org##h1',
                domain: 'example.org',
                enabled: true,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
            {
                id: 1,
                ruleText: '@@||google.com$domain=adguard.com',
                domain: 'adguard.com',
                enabled: true,
                type: UserRuleType.SITE_ALLOWED,
            },
            {
                id: 2,
                ruleText: '||google.com^$domain=baddomain.com',
                domain: 'baddomain.com',
                enabled: false,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 3,
                ruleText: '||google.com^',
                domain: null,
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
        ]);
    });

    it('disables rules', () => {
        const userRulesString = `example.org##h1
!! some comment
@@||google.com$domain=adguard.com
||google.com^$domain=baddomain.com
!off!||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);
        userRulesProcessor.disableRule(0);
        userRulesProcessor.disableRule(3);
        userRulesProcessor.disableRule(4);
        // disabling of non-existing rule doesn't affects anything
        userRulesProcessor.disableRule(6);
        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.org##h1',
                domain: 'example.org',
                enabled: false,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
            {
                id: 2,
                ruleText: '@@||google.com$domain=adguard.com',
                domain: 'adguard.com',
                enabled: true,
                type: UserRuleType.SITE_ALLOWED,
            },
            {
                id: 3,
                ruleText: '||google.com^$domain=baddomain.com',
                domain: 'baddomain.com',
                enabled: false,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 4,
                ruleText: '||google.com^',
                domain: null,
                enabled: false,
                type: UserRuleType.SITE_BLOCKED,
            },
        ]);
    });

    it('updates rules', () => {
        const userRulesString = `example.org##h1
!! some comment
@@||google.com$domain=adguard.com
||google.com^$domain=baddomain.com
!off!||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);
        userRulesProcessor.updateRule(0, 'example.com##h1');
        userRulesProcessor.updateRule(4, '||google.org^');

        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.com##h1',
                domain: 'example.com',
                enabled: true,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
            {
                id: 2,
                ruleText: '@@||google.com$domain=adguard.com',
                domain: 'adguard.com',
                enabled: true,
                type: UserRuleType.SITE_ALLOWED,
            },
            {
                id: 3,
                ruleText: '||google.com^$domain=baddomain.com',
                domain: 'baddomain.com',
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 4,
                ruleText: '||google.org^',
                domain: null,
                enabled: false,
                type: UserRuleType.SITE_BLOCKED,
            },
        ]);
    });

    it('deletes rule', () => {
        const userRulesString = `example.org##h1
@@||google.com$domain=adguard.com
||google.com^$domain=baddomain.com
!off!||google.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);
        userRulesProcessor.deleteRule(0);
        userRulesProcessor.deleteRule(0);

        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: '||google.com^$domain=baddomain.com',
                domain: 'baddomain.com',
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 1,
                ruleText: '||google.com^',
                domain: null,
                enabled: false,
                type: UserRuleType.SITE_BLOCKED,
            },
        ]);
    });

    it('detects rule type', () => {
        const userRulesString = `example.org##h1
||example.org^
@@||example.com^
`;
        const userRulesProcessor = new UserRulesProcessor(userRulesString);

        const userRulesData = userRulesProcessor.getData();

        expect(userRulesData).toEqual([
            {
                id: 0,
                ruleText: 'example.org##h1',
                domain: 'example.org',
                enabled: true,
                type: UserRuleType.ELEMENT_BLOCKED,
            },
            {
                id: 1,
                ruleText: '||example.org^',
                domain: null,
                enabled: true,
                type: UserRuleType.SITE_BLOCKED,
            },
            {
                id: 2,
                ruleText: '@@||example.com^',
                domain: null,
                enabled: true,
                type: UserRuleType.SITE_ALLOWED,
            },
        ]);
    });
});
