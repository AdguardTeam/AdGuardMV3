export enum SETTINGS_NAMES {
    FILTERING_ENABLED = 'filtering.enabled',
    POPUP_V3_WIZARD_ENABLED = 'popup.v3.wizard.enabled',
    NOTICE_HIDDEN = 'notice.hidden',
}

export type SettingsType = Record<SETTINGS_NAMES, boolean>;

export const DEFAULT_SETTINGS: SettingsType = {
    [SETTINGS_NAMES.FILTERING_ENABLED]: true,
    [SETTINGS_NAMES.POPUP_V3_WIZARD_ENABLED]: true,
    [SETTINGS_NAMES.NOTICE_HIDDEN]: false,
};
