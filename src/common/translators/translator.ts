import { translate } from '@adguard/translate';

import { addWrapperForGetPlural, i18n } from './i18n';

/**
 * Retrieves localized message by key, formats it and converts into string
 */
const t = translate.createTranslator(i18n);

const translator = addWrapperForGetPlural(t);

export { translator };
