import { SettingsType } from './settings-constants';
import { IconId } from './icons';

export interface PopupData {
    settings: SettingsType,
    isAllowlisted: boolean,
    enableFiltersIds: number[],
}

export type CategoriesType = {
    groupId: number,
    groupName: string,
    displayNumber: number,
}[];

export type RuleSetCounters = {
    filterId: number,
    rulesCount: number,
    regexpRulesCount: number
};

export interface FilterInfo {
    id: number,
    iconId?: IconId,
    title: string,
    enabled: boolean,
    description?: string,
    groupId: FiltersGroupId,
    url?: string,
    localeCodes?: string[],
}

export interface FilterMetaData {
    title: string,
    description?: string,
    homepage?: string,
    version?: string,
    expires?: string,
    timeUpdated?: string,
    url?: string,
}

export const FILTERS_I18N_FILENAME = 'filters_i18n.json';

export interface OptionsData {
    settings: SettingsType,
    filters: FilterInfo[],
    categories: CategoriesType,
    ruleSetsCounters: RuleSetCounters[],
}

// These enum must have string values because
// we need to fast identify message in the log
export enum MESSAGE_TYPES {
    GET_OPTIONS_DATA = 'GET_OPTIONS_DATA',
    GET_POPUP_DATA = 'GET_POPUP_DATA',
    OPEN_OPTIONS = 'OPEN_OPTIONS',
    SET_SETTING = 'SET_SETTING',
    REPORT_SITE = 'REPORT_SITE',
    OPEN_ASSISTANT = 'OPEN_ASSISTANT',
    START_ASSISTANT = 'START_ASSISTANT',
    ADD_USER_RULE = 'ADD_USER_RULE',
    RELOAD_ACTIVE_TAB = 'RELOAD_ACTIVE_TAB',
    TOGGLE_PROTECTION = 'TOGGLE_PROTECTION',
    PAUSE_PROTECTION_WITH_TIMEOUT = 'PAUSE_PROTECTION_WITH_TIMEOUT',
    ENABLE_FILTER = 'ENABLE_FILTER',
    DISABLE_FILTER = 'DISABLE_FILTER',
    UPDATE_FILTER_TITLE = 'UPDATE_FILTER_TITLE',
    GET_FILTER_INFO_BY_CONTENT = 'GET_FILTER_INFO_BY_CONTENT',
    ADD_CUSTOM_FILTER_BY_CONTENT = 'ADD_CUSTOM_FILTER_BY_CONTENT',
    GET_FILTER_CONTENT_BY_URL = 'GET_FILTER_CONTENT_BY_URL',
    REMOVE_CUSTOM_FILTER_BY_ID = 'REMOVE_CUSTOM_FILTER_BY_ID',
    ADD_FILTERING_SUBSCRIPTION = 'ADD_FILTERING_SUBSCRIPTION',
    GET_USER_RULES = 'GET_USER_RULES',
    SET_USER_RULES = 'SET_USER_RULES',
    GET_DYNAMIC_RULES_STATUS = 'GET_DYNAMIC_RULES_STATUS',
    RELAUNCH_FILTERING = 'RELAUNCH_FILTERING',
    TOGGLE_SITE_ALLOWLIST_STATUS = 'TOGGLE_SITE_ALLOWLIST_STATUS',
    ADD_USER_RULE_FROM_ASSISTANT = 'ADD_USER_RULE_FROM_ASSISTANT',
    GET_FILTERS_NAMES = 'GET_FILTERS_NAMES',
    START_LOG = 'START_LOG',
    STOP_LOG = 'STOP_LOG',

    // TODO: Remove
    PING = 'PING',

    ADD_LONG_LIVED_CONNECTION = 'ADD_LONG_LIVED_CONNECTION',
    NOTIFY_LISTENERS = 'NOTIFY_LISTENERS',
}

export type MessageType = keyof typeof MESSAGE_TYPES;

export type Message = {
    type: MessageType;
    data?: any;
};

// These enumerations must have string values because
// their values are used as keys in the object
export enum NOTIFIER_EVENTS {
    PROTECTION_UPDATED = 'event.protection.updated',
    PROTECTION_RESUMED = 'event.protection.resumed',
    PROTECTION_PAUSE_EXPIRED = 'event.protection.pause.expired',
    SET_RULES = 'event.set.rules',
}

/* GLOBAL FILTERING */
export const MS_IN_SECOND = 10 ** 3;
export const PROTECTION_PAUSE_TIMEOUT_S = 30;
export const PROTECTION_PAUSE_TIMEOUT_MS = PROTECTION_PAUSE_TIMEOUT_S * MS_IN_SECOND;

export const NEW_LINE_SEPARATOR = '\n';

/* parameters to subscribing to filters */
export const QUERY_PARAM_NAMES = {
    TITLE: 'title',
    SUBSCRIBE: 'subscribe',
};

// TODO: Rename enum
export enum UserRuleType {
    SITE_BLOCKED = 'SITE_BLOCKED',
    ELEMENT_BLOCKED = 'ELEMENT_BLOCKED',
    SITE_ALLOWED = 'SITE_ALLOWED',
    CUSTOM = 'CUSTOM',
}

// TODO: Rename enum
export enum FiltersGroupId {
    CUSTOM = 0,
    MAIN = 3,
    LANGUAGES = 7,
}

// TODO: Change with migration
export interface Rules {
    id: number,
    rules: string,
}

export const OTHER_DOMAIN_TITLE = 'other';

// eslint-disable-next-line max-len
export const REGEX_DOMAIN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9]$/;

export const REGEX_DOMAIN_IN_RULE = /(?<=\|\|)(.*?)(?=\^|\/|:|\$)/g;

export const WEB_ACCESSIBLE_RESOURCES_PATH = '/web-accessible-resources/redirects';
