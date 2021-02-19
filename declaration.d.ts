declare module '*.module.pcss' {
    const content: Record<string, string>;
    export default content;
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
