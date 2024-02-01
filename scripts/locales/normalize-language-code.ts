import type { Locale } from '@adguard/translate';

export const normalizeLanguageCode = (code: string): Locale => {
    return code.toLowerCase().substring(0, 2) as Locale;
};
