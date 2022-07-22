export enum SETTINGS_NAMES {
    /* VERSION */
    VERSION = 'version',

    /* PAGE FILTERING */
    FILTERING_ENABLED = 'filtering.enabled',

    /* GLOBAL FILTERING */
    PROTECTION_PAUSE_EXPIRES = 'protection.pause.expires',
    PROTECTION_ENABLED = 'protection.enabled',

    POPUP_V3_WIZARD_ENABLED = 'popup.v3.wizard.enabled',
    NOTICE_HIDDEN = 'notice.hidden',
}

export type OPTION_SETTINGS_NAMES = Pick<SettingsType,
SETTINGS_NAMES.FILTERING_ENABLED | SETTINGS_NAMES.NOTICE_HIDDEN>;

export type SettingsValueType = boolean | number;

export type SettingsType = Record<SETTINGS_NAMES, SettingsValueType>;

export const SCHEME_VERSION = 1;

export const DEFAULT_SETTINGS: SettingsType = {
    [SETTINGS_NAMES.VERSION]: SCHEME_VERSION,

    [SETTINGS_NAMES.FILTERING_ENABLED]: true,

    [SETTINGS_NAMES.PROTECTION_ENABLED]: true,
    [SETTINGS_NAMES.PROTECTION_PAUSE_EXPIRES]: 0,

    [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: true,
    [SETTINGS_NAMES.NOTICE_HIDDEN]: false,
};
