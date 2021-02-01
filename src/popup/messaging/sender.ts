import { sendMessage } from 'Common/helpers';
import { MESSAGE_TYPES, PopupData } from 'Common/constants';

export const sender = {
    setFilteringEnabled: (filteringEnabled: boolean) => sendMessage(
        MESSAGE_TYPES.SET_FILTERING_ENABLED,
        { filteringEnabled },
    ),
    getPopupData: () => sendMessage<PopupData>(MESSAGE_TYPES.GET_POPUP_DATA),
    openOptions: () => sendMessage(MESSAGE_TYPES.OPEN_OPTIONS),
    disableWizard: () => sendMessage(MESSAGE_TYPES.DISABLE_WIZARD),
    reportSite: () => sendMessage(MESSAGE_TYPES.REPORT_SITE),
};
