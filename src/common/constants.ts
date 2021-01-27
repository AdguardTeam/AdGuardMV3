export interface PopupData {
    filteringEnabled: boolean,
    wizardEnabled: boolean,
}

export const MESSAGE_TYPES = {
    GET_FILTERING_ENABLED: 'GET_FILTERING_ENABLED',
    SET_FILTERING_ENABLED: 'SET_FILTERING_ENABLED',
    GET_CSS: 'GET_CSS',
    OPEN_OPTIONS: 'OPEN_OPTIONS',
    DISABLE_WIZARD: 'DISABLE_WIZARD',
    GET_POPUP_DATA: 'GET_POPUP_DATA',
} as const;
