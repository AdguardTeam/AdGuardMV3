import React from 'react';
import { translate } from '@adguard/translate';

import { addWrapperForGetPlural, i18n } from './i18n';

/**
 * Retrieves localized messages by key, formats and converts into react components or string
 */
const t = translate.createReactTranslator(i18n, React, {
    tags: [{
        key: 'newline',
        createdTag: 'br',
    }],
});

const reactTranslator = addWrapperForGetPlural(t);

export { reactTranslator };
