import { SettingsType } from './settings-constants';
import { IconId } from './icons';

export interface PopupData {
    settings: SettingsType,
    userRules: string,
    enableFiltersIds: number[],
}

export type CategoriesType = {
    groupId: number,
    groupName: string,
    displayNumber: number,
}[];

export interface Filter {
    id: number,
    iconId?: IconId,
    title: string,
    enabled: boolean,
    description?: string,
    groupId: FiltersGroupId,
    url?: string,
    regexpRulesCounter?: number,
    declarativeRulesCounter?: number,
    localeCodes?: string[],
}

export interface FilterInfo {
    title: string,
    description?: string,
    homepage?: string,
    version?: string,
    expires?: string,
    timeUpdated?: string,
    url?: string,
}

export const FILTERS_I18N_FILENAME = 'filters_i18n.json';
export const FILTERS_RULES_COUNTER_FILENAME = 'filters_rules_counter.json';
export const FILTERS_REGEXP_COUNTER_FILENAME = 'filters_regexp_counter.json';

export const FILTERS_VERSIONS_FILENAME = 'filters_versions.json';

export interface OptionsData {
    settings: SettingsType,
    filters: Filter[],
    categories: CategoriesType
}

export enum MESSAGE_TYPES {
    GET_OPTIONS_DATA = 'GET_OPTIONS_DATA',
    GET_POPUP_DATA = 'GET_POPUP_DATA',
    GET_CSS = 'GET_CSS',
    OPEN_OPTIONS = 'OPEN_OPTIONS',
    SET_SETTING = 'SET_SETTING',
    REPORT_SITE = 'REPORT_SITE',
    OPEN_ASSISTANT = 'OPEN_ASSISTANT',
    START_ASSISTANT = 'START_ASSISTANT',
    ADD_USER_RULE = 'ADD_USER_RULE',
    RELOAD_ACTIVE_TAB = 'RELOAD_ACTIVE_TAB',
    REMOVE_PROTECTION_PAUSE_TIMER = 'REMOVE_PROTECTION_PAUSE_TIMER',
    SET_PAUSE_EXPIRES = 'SET_PAUSE_EXPIRES',
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
    GET_DEBUG_INFO = 'GET_DEBUG_INFO',
    GET_DYNAMIC_RULES_LIMITS = 'GET_DYNAMIC_RULES_LIMITS',
    RELAUNCH_FILTERING = 'RELAUNCH_FILTERING',
    TOGGLE_SITE_ALLOWLIST_STATUS = 'TOGGLE_SITE_ALLOWLIST_STATUS',
    ADD_USER_RULE_FROM_ASSISTANT = 'ADD_USER_RULE_FROM_ASSISTANT',
    CHECK_SITE_IN_ALLOWLIST = 'CHECK_SITE_IN_ALLOWLIST',

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

export enum NOTIFIER_EVENTS {
    PROTECTION_UPDATED,
    PROTECTION_PAUSE_EXPIRES_UPDATED,
    SET_RULES,
}

/* GLOBAL FILTERING */
export const MS_IN_SECOND = 10 ** 3;
export const PROTECTION_PAUSE_TIMEOUT_S = 30;
export const PROTECTION_PAUSE_TIMEOUT_TICK_S = 1;
export const PROTECTION_PAUSE_TIMEOUT_MS = PROTECTION_PAUSE_TIMEOUT_S * MS_IN_SECOND;
export const PROTECTION_PAUSE_TIMEOUT_TICK_MS = PROTECTION_PAUSE_TIMEOUT_TICK_S * MS_IN_SECOND;

export const NEW_LINE_SEPARATOR = '\n';

/* parameters to subscribing to filters */
export const QUERY_PARAM_NAMES = {
    TITLE: 'title',
    SUBSCRIBE: 'subscribe',
};

export enum UserRuleType {
    SITE_BLOCKED = 'SITE_BLOCKED',
    ELEMENT_BLOCKED = 'ELEMENT_BLOCKED',
    SITE_ALLOWED = 'SITE_ALLOWED',
    CUSTOM = 'CUSTOM',
}

export enum FiltersGroupId {
    CUSTOM = 0,
    INTEGRATED = 2,
    MAIN = 3,
    LANGUAGES = 7,
}

export interface Rules {
    id: number,
    rules: string,
}

export const RULESET_NAME = 'ruleset_';

export const OTHER_DOMAIN_TITLE = 'other';

// eslint-disable-next-line max-len
export const REGEX_DOMAIN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9]$/;

export const REGEX_DOMAIN_IN_RULE = /(?<=\|\|)(.*?)(?=\^|\/|:|\$)/g;
