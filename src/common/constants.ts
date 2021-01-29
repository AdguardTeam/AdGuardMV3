export interface PopupData {
    filteringEnabled: boolean,
    wizardEnabled: boolean,
}

export interface OptionsData {
    noticeHidden: boolean,
}

export const MESSAGE_TYPES = {
    GET_FILTERING_ENABLED: 'GET_FILTERING_ENABLED',
    SET_FILTERING_ENABLED: 'SET_FILTERING_ENABLED',
    GET_OPTIONS_DATA: 'GET_OPTIONS_DATA',
    SET_OPTIONS_DATA: 'SET_OPTIONS_DATA',
    GET_CSS: 'GET_CSS',
    OPEN_OPTIONS: 'OPEN_OPTIONS',
    DISABLE_WIZARD: 'DISABLE_WIZARD',
    GET_POPUP_DATA: 'GET_POPUP_DATA',
} as const;

export type MessageType = keyof typeof MESSAGE_TYPES;

export type Message = {
    type: MessageType;
    data?: any;
};
