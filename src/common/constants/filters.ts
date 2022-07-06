import { CategoriesType } from './common';

export enum RulesetType {
    RULESET_1 = 'ruleset_1',
    RULESET_2 = 'ruleset_2',
    RULESET_3 = 'ruleset_3',
    RULESET_4 = 'ruleset_4',
    RULESET_6 = 'ruleset_6',
    RULESET_7 = 'ruleset_7',
    RULESET_8 = 'ruleset_8',
    RULESET_9 = 'ruleset_9',
    RULESET_13 = 'ruleset_13',
    RULESET_14 = 'ruleset_14',
    RULESET_16 = 'ruleset_16',
    RULESET_224 = 'ruleset_224',
}

export const FILTER_RULESET = {
    [RulesetType.RULESET_1]: { id: 1, enabled: false },
    [RulesetType.RULESET_2]: { id: 2, enabled: true },
    [RulesetType.RULESET_3]: { id: 3, enabled: false },
    [RulesetType.RULESET_4]: { id: 4, enabled: false },
    [RulesetType.RULESET_6]: { id: 6, enabled: false },
    [RulesetType.RULESET_7]: { id: 7, enabled: false },
    [RulesetType.RULESET_8]: { id: 8, enabled: false },
    [RulesetType.RULESET_9]: { id: 9, enabled: false },
    [RulesetType.RULESET_13]: { id: 13, enabled: false },
    [RulesetType.RULESET_14]: { id: 14, enabled: false },
    [RulesetType.RULESET_16]: { id: 16, enabled: false },
    [RulesetType.RULESET_224]: { id: 224, enabled: false },
};

export const ADGUARD_FILTERS_IDS = Object.values(FILTER_RULESET);

export const CATEGORIES: CategoriesType = [
    {
        groupId: 1,
        groupName: 'Ad Blocking',
        displayNumber: 1,
    },
    {
        groupId: 3,
        groupName: 'Social Widgets',
        displayNumber: 3,
    },
    {
        groupId: 4,
        groupName: 'Annoyances',
        displayNumber: 4,
    },
    {
        groupId: 5,
        groupName: 'Security',
        displayNumber: 5,
    },
    {
        groupId: 7,
        groupName: 'Language-specific',
        displayNumber: 7,
    },
];
