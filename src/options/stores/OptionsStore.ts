import {
    action,
    computed,
    observable,
    makeObservable,
    runInAction,
} from 'mobx';
import _ from 'lodash';

import { sender } from 'Options/messaging/sender';
import { UserRulesProcessor, UserRulesData } from 'Options/user-rules-processor';
import { OTHER_DOMAIN_TITLE, NEW_LINE_SEPARATOR } from 'Common/constants/common';
import { translator } from 'Common/translators/translator';
import { log } from 'Common/logger';

import type { UserRulesLimits } from '../../background/userRules';

import type { RootStore } from './RootStore';

export enum UserRuleWizardNewType {
    CUSTOM = 'CUSTOM',
    BLOCKING = 'BLOCKING',
    UNBLOCKING = 'UNBLOCKING',
}

export enum UserRuleWizardAction {
    NEW = 'NEW',
    EDIT = 'EDIT',
}

interface UserRuleInWizard {
    id: number,
    ruleText: string,
}

const {
    MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES,
    MAX_NUMBER_OF_REGEX_RULES,
} = chrome.declarativeNetRequest;

// TODO: Remove when UI of Editor will be changed
const ERROR_UI_MESSAGES: { [key: string]: string } = {
    1001: translator.getMessage('error_rule_is_invalid'),
    1002: translator.getMessage('error_rules_limit', { limit: MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES }),
    1003: translator.getMessage('error_regexp_rules_limit', { limit: MAX_NUMBER_OF_REGEX_RULES }),
    DEFAULT: translator.getMessage('error_rule_is_invalid'),
};

export enum DYNAMIC_RULES_LIMITS_ERROR {
    MAX_DYNAMIC_RULES_EXCEED,
    MAX_DYNAMIC_REGEXPS_EXCEED,
}

export class OptionsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    userRules = '';

    @observable
    userRulesDeclarativeRulesCount: number = 0;

    @observable
    userRulesRegexpsCount: number = 0;

    @observable
    editorOpen = false;

    @observable
    userRuleWizardOpen = false;

    @observable
    userRuleWizardAction = UserRuleWizardAction.NEW;

    @observable
    userRuleInWizard: UserRuleInWizard | null = null;

    @observable
    userRuleWizardNewType = UserRuleWizardNewType.CUSTOM;

    @observable
    createdUserRuleText = '';

    @observable
    error = '';

    @computed
    get isMaxEnabledDynamicRules() {
        const max = MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES;
        return this.userRulesDeclarativeRulesCount > max;
    }

    @computed
    get isMaxEnabledDynamicRulesRegexps() {
        const max = MAX_NUMBER_OF_REGEX_RULES;
        return this.userRulesRegexpsCount > max;
    }

    @computed
    get userRulesGroups() {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        const userRulesData = userRulesProcessor.getData();

        const userRulesGroupedByDomain = _.groupBy(userRulesData, (userRuleData) => {
            return userRuleData.domain || OTHER_DOMAIN_TITLE;
        });

        const userRulesGroups = Object.entries(userRulesGroupedByDomain);

        const sortedGroups = userRulesGroups.sort((groupA, groupB) => {
            const [domainA] = groupA;
            const [domainB] = groupB;

            if (domainA === domainB) {
                return 0;
            }

            if (domainA === OTHER_DOMAIN_TITLE) {
                return 1;
            }

            if (domainB === OTHER_DOMAIN_TITLE) {
                return -1;
            }

            return domainA > domainB ? 1 : -1;
        });

        const { matchesSearchQuery } = this.rootStore.searchStore;

        const filteredRules = (rules: UserRulesData[]) => {
            return rules.filter((rule) => {
                return matchesSearchQuery(rule.ruleText);
            });
        };

        const filteredGroups = sortedGroups.filter((group) => {
            const [, userRules] = group;
            return filteredRules(userRules).length > 0;
        });

        const filteredRuleGroups = filteredGroups.map((group) => {
            const [, userRules] = group;
            group.splice(1, 1, filteredRules(userRules));
            return group;
        });

        return filteredRuleGroups;
    }

    @action
    getDynamicRulesCounters = async () => {
        const { setLoader } = this.rootStore.uiStore;
        setLoader(true);

        const userRulesLimits = await sender.getDynamicRulesCounters();
        await this.setDynamicRulesCounters(userRulesLimits);

        setLoader(false);
    };

    @action
    setDynamicRulesCounters = async (userRulesLimits: UserRulesLimits) => {
        const {
            declarativeRulesCount,
            regexpsCount,
        } = userRulesLimits;

        this.userRulesDeclarativeRulesCount = declarativeRulesCount;
        this.userRulesRegexpsCount = regexpsCount;
    };

    @action
    /**
     * This action, unlike 'setUserRules', only updates the rule counter and saves new user rules in the store,
     * without calling the background to save the user rules
     */
    updateUserRules = async (userRules: string): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> => {
        const { setLoader } = this.rootStore.uiStore;
        setLoader(true);

        let resError: DYNAMIC_RULES_LIMITS_ERROR | null = null;

        try {
            const userRulesLimits = await sender.getDynamicRulesCounters();
            await this.setDynamicRulesCounters(userRulesLimits);

            this.closeEditor();
            this.closeUserRuleWizard();

            resError = this.checkLimitsAndNotify();

            runInAction(() => {
                this.userRules = userRules;
            });
        } catch (e: any) {
            log.error(e);
        }

        setLoader(false);

        return resError;
    };

    @action
    setUserRules = async (userRules: string): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> => {
        const { setLoader } = this.rootStore.uiStore;
        if (this.userRules === userRules) {
            return null;
        }

        setLoader(true);

        try {
            await sender.setUserRules(userRules);
        } catch (e: any) {
            log.error(e);

            const statusCode = e.message.match(/\d+/);
            const error = ERROR_UI_MESSAGES[statusCode]
                ? ERROR_UI_MESSAGES[statusCode]
                : ERROR_UI_MESSAGES.DEFAULT;
            this.setError(error);
        }

        setLoader(false);

        return this.updateUserRules(userRules);
    };

    checkLimitsAndNotify(): DYNAMIC_RULES_LIMITS_ERROR | null {
        if (this.isMaxEnabledDynamicRules) {
            return DYNAMIC_RULES_LIMITS_ERROR.MAX_DYNAMIC_REGEXPS_EXCEED;
        }

        if (this.isMaxEnabledDynamicRulesRegexps) {
            return DYNAMIC_RULES_LIMITS_ERROR.MAX_DYNAMIC_RULES_EXCEED;
        }

        return null;
    }

    @action
    fetchUserRules = async () => {
        const { setLoader } = this.rootStore.uiStore;

        setLoader(true);

        const result = await sender.getUserRules();
        runInAction(() => {
            this.userRules = result;
        });

        setLoader(false);
    };

    @action
    setError(value: string) {
        this.error = value;
    }

    @action
    resetError() {
        this.error = '';
    }

    @action
    openEditor() {
        this.editorOpen = true;
    }

    @action
    closeEditor = () => {
        this.resetError();
        this.editorOpen = false;
    };

    @action
    enableRule = (ruleId: number): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> => {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.enableRule(ruleId);
        return this.setUserRules(userRulesProcessor.getUserRules());
    };

    @action
    disableRule = async (ruleId: number): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> => {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.disableRule(ruleId);
        return this.setUserRules(userRulesProcessor.getUserRules());
    };

    @action
    openEditUserRuleWizard(userRule: UserRuleInWizard) {
        this.userRuleInWizard = userRule;
        this.openUserRuleWizard(UserRuleWizardAction.EDIT);
    }

    @action
    openNewUserRuleWizard() {
        this.userRuleWizardNewType = UserRuleWizardNewType.CUSTOM;
        this.openUserRuleWizard(UserRuleWizardAction.NEW);
        this.createdUserRuleText = '';
    }

    @action
    openUserRuleWizard(wizardAction = UserRuleWizardAction.NEW) {
        this.userRuleWizardOpen = true;
        this.userRuleWizardAction = wizardAction;
    }

    @action
    closeUserRuleWizard() {
        this.resetError();
        this.userRuleWizardOpen = false;
    }

    @action
    setUserRuleWizardNewType(type: UserRuleWizardNewType) {
        this.userRuleWizardNewType = type;
        this.createdUserRuleText = '';
    }

    @action
    updateCreatedUserRule(ruleText: string) {
        this.createdUserRuleText = ruleText;
    }

    @action
    addCreatedUserRule() {
        const newUserRules = this.userRules
            ? `${this.userRules}${NEW_LINE_SEPARATOR}${this.createdUserRuleText}`
            : this.createdUserRuleText;
        return this.setUserRules(newUserRules);
    }

    @action
    updateUserRuleInWizard(value: string) {
        if (!this.userRuleInWizard) {
            throw new Error('User rule in wizard should be defined to update it');
        }
        this.userRuleInWizard.ruleText = value;
    }

    @action
    saveUserRuleInWizard(): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> {
        if (!this.userRuleInWizard) {
            throw new Error('User rule in wizard should be defined to save it');
        }
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.updateRule(this.userRuleInWizard.id, this.userRuleInWizard.ruleText);
        this.closeUserRuleWizard();
        return this.setUserRules(userRulesProcessor.getUserRules());
    }

    @action
    deleteUserRuleInWizard(): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> {
        if (!this.userRuleInWizard) {
            throw new Error('User rule in wizard should be defined to delete it');
        }
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.deleteRule(this.userRuleInWizard.id);
        return this.setUserRules(userRulesProcessor.getUserRules());
    }

    @action
    addNewUserRule(newRule: string): Promise<DYNAMIC_RULES_LIMITS_ERROR | null> {
        const newUserRules = `${this.userRules}${NEW_LINE_SEPARATOR}${newRule}`;
        this.closeUserRuleWizard();
        return this.setUserRules(newUserRules);
    }
}
