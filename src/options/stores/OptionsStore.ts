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
import { NEW_LINE_SEPARATOR } from 'Common/constants';
import { OTHER_DOMAIN_TITLE } from 'Options/constants';

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

export class OptionsStore {
    public rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable
    userRules = '';

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
    setUserRules = (userRules: string) => {
        if (this.userRules === userRules) {
            return;
        }

        this.userRules = userRules;
        sender.setUserRules(this.userRules);
    };

    @action
    fetchUserRules = async () => {
        const result = await sender.getUserRules();
        runInAction(() => {
            this.userRules = result;
        });
    };

    @action
    openEditor() {
        this.editorOpen = true;
    }

    @action
    closeEditor = () => {
        this.editorOpen = false;
    };

    @action
    enableRule = (ruleId: number) => {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.enableRule(ruleId);
        this.setUserRules(userRulesProcessor.getUserRules());
    };

    @action
    disableRule = (ruleId: number) => {
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.disableRule(ruleId);
        this.setUserRules(userRulesProcessor.getUserRules());
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
        const newUserRules = `${this.userRules}${NEW_LINE_SEPARATOR}${this.createdUserRuleText}`;
        this.setUserRules(newUserRules);
    }

    @action
    updateUserRuleInWizard(value: string) {
        if (!this.userRuleInWizard) {
            throw new Error('User rule in wizard should be defined to update it');
        }
        this.userRuleInWizard.ruleText = value;
    }

    @action
    saveUserRuleInWizard() {
        if (!this.userRuleInWizard) {
            throw new Error('User rule in wizard should be defined to save it');
        }
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.updateRule(this.userRuleInWizard.id, this.userRuleInWizard.ruleText);
        this.setUserRules(userRulesProcessor.getUserRules());
        this.closeUserRuleWizard();
    }

    @action
    deleteUserRuleInWizard() {
        if (!this.userRuleInWizard) {
            throw new Error('User rule in wizard should be defined to delete it');
        }
        const userRulesProcessor = new UserRulesProcessor(this.userRules);
        userRulesProcessor.deleteRule(this.userRuleInWizard.id);
        this.setUserRules(userRulesProcessor.getUserRules());
        this.closeUserRuleWizard();
    }

    @action
    addNewUserRule(newRule: string) {
        const newUserRules = `${this.userRules}${NEW_LINE_SEPARATOR}${newRule}`;
        this.setUserRules(newUserRules);
        this.closeUserRuleWizard();
    }
}
