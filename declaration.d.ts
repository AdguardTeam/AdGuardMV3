declare module '*.module.pcss' {
    const content: Record<string, string>;
    export default content;
}

// TODO: Remove when chrome will update @types (last checked in @types/chrome v0.0.193:)
declare module chrome.declarativeNetRequest {
    // The maximum number of static Rulesets an extension can enable at any one time.
    export const MAX_NUMBER_OF_ENABLED_STATIC_RULESETS: number;
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

// TODO: Remove when chrome will update @types (last checked in @types/chrome v0.0.193:)
declare module chrome.declarativeNetRequest {
    // The maximum number of static Rulesets an extension can enable at any one time.
    export const MAX_NUMBER_OF_ENABLED_STATIC_RULESETS: number;
}
