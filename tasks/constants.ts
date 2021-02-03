export enum BUILD_ENVS {
    DEV ='dev',
    BETA ='beta',
    RELEASE ='release',
}

export enum BROWSERS {
    CHROME = 'chrome',
    EDGE = 'edge',
}

export type localeUrlType = { locale: string, url: string };
export type localeDataType = { locale: string, data: Buffer };
export type localeMessageType = { [key: string]: { message: string } };
export type translationResultType = {
    locale: string,
    level: number,
    untranslatedStrings: string[]
};
