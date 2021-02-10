export enum SETTINGS_NAMES {
    FILTERING_ENABLED = 'filtering.enabled',
    GLOBAL_FILTERING_PAUSE_EXPIRES = 'global.filtering.pause.expires',
    PROTECTION_ENABLED = 'protection.enabled',

    POPUP_V3_WIZARD_ENABLED = 'popup.v3.wizard.enabled',
    NOTICE_HIDDEN = 'notice.hidden',
}

export type SettingsValueType = boolean | number;

export type SettingsType = Record<SETTINGS_NAMES, SettingsValueType>;

export const DEFAULT_SETTINGS: SettingsType = {
    [SETTINGS_NAMES.FILTERING_ENABLED]: true,
    [SETTINGS_NAMES.PROTECTION_ENABLED]: true,
    [SETTINGS_NAMES.GLOBAL_FILTERING_PAUSE_EXPIRES]: 0,

    [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: true,
    [SETTINGS_NAMES.NOTICE_HIDDEN]: false,
};
