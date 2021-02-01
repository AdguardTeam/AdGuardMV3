import { SettingsType } from '../background/settings/settings-constants';

export interface PopupData {
    settings: SettingsType
}

export interface OptionsData {
    settings: SettingsType
}

export const MESSAGE_TYPES = {
    GET_OPTIONS_DATA: 'GET_OPTIONS_DATA',
    GET_POPUP_DATA: 'GET_POPUP_DATA',
    GET_CSS: 'GET_CSS',
    OPEN_OPTIONS: 'OPEN_OPTIONS',
    SET_SETTING: 'SET_SETTING',

    ADD_LONG_LIVED_CONNECTION: 'ADD_LONG_LIVED_CONNECTION',
    NOTIFY_LISTENERS: 'NOTIFY_LISTENERS',
} as const;

export type MessageType = keyof typeof MESSAGE_TYPES;

export type Message = {
    type: MessageType;
    data?: any;
};

export enum NOTIFIER_EVENTS {
    SETTING_UPDATED = 'event.setting.updated',
}
