declare module '*.module.pcss' {
    const content: Record<string, string>;
    export default content;
}

// TODO: Remove, when ManifestRulesetInfo will appear in
// (last checked in @types/chrome v0.0.193: there is no such type)
type ManifestRulesetInfo = {
    id: string,
    enabled: Boolean,
    path: string,
};

type RuleResources = {
    rule_resources: ManifestRulesetInfo[];
};

declare module chrome.runtime {
    export interface ManifestV3 {
        declarative_net_request: RuleResources;
    }
}
