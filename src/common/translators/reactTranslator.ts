import React from 'react';
import { translate } from '@adguard/translate';

import { i18n } from './i18n';

/**
 * Retrieves localized messages by key, formats and converts into react components or string
 */
export const reactTranslator = translate.createReactTranslator(i18n, React, {
    tags: [{
        key: 'newline',
        createdTag: 'br',
    }],
});
