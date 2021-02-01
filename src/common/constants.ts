export interface FilteringState {
    filteringEnabled: boolean,
}

export interface PopupData extends FilteringState {
    wizardEnabled: boolean,
}

export interface OptionsData extends FilteringState {
    noticeHidden: boolean,
}

export const MESSAGE_TYPES = {
    SET_FILTERING_ENABLED: 'SET_FILTERING_ENABLED',
    GET_OPTIONS_DATA: 'GET_OPTIONS_DATA',
    SET_NOTICE_HIDDEN: 'SET_NOTICE_HIDDEN',
    GET_CSS: 'GET_CSS',
    OPEN_OPTIONS: 'OPEN_OPTIONS',
    REPORT_SITE: 'REPORT_SITE',
    DISABLE_WIZARD: 'DISABLE_WIZARD',
    GET_POPUP_DATA: 'GET_POPUP_DATA',
} as const;

export type MessageType = keyof typeof MESSAGE_TYPES;

export type Message = {
    type: MessageType;
    data?: any;
};

export const REPORT_SITE_BASE_URL = 'https://reports.adguard.com/new_issue.html';
