declare module '*.module.pcss' {
    const content: Record<string, string>;
    export default content;
}

declare module '@adguard/filters-downloader' {
    interface DefinedExpressions {
        adguard?: boolean,
        adguard_ext_chromium?: boolean,
        adguard_ext_firefox?: boolean,
        adguard_ext_edge?: boolean,
        adguard_ext_safari?: boolean,
        adguard_ext_opera?: boolean,
        adguard_ext_android_cb?: boolean
    }

    interface Download {
        (url: string, options: DefinedExpressions): Promise<string[]>;
    }

    const download: Download;

    export default {
        download,
    };
}

interface Filter {
    id: number,
    title: string,
    enabled: boolean,
    description: string,
    groupId: number,
}

interface FilterInfo {
    title: string,
    description?: string,
    homepage?: string,
    version?: string,
    expires?: string,
    timeUpdated?: string,
    url?: string,
}
