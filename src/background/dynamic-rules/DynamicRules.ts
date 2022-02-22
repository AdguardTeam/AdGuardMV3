import * as TSUrlFilter from '@adguard/tsurlfilter';

type DeclarativeRule = chrome.declarativeNetRequest.Rule;

// TODO validate rule regexp
// TODO show error messages when rules are created
// TODO handle MAX_NUMBER_OF_REGEX_RULES
// TODO apply cosmetic rules via chrome.declarativeContent https://developer.chrome.com/docs/extensions/reference/declarativeContent/
/**
 * https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest
 */
export class DynamicRules {
    MAX_NUMBER_OF_RULES = chrome.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES;

    async setRules(rules: string) {
        const convertedRules = this.convertRules(rules);

        // get existing dynamic rules
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const existingRulesIds = existingRules.map((rule) => rule.id);

        // remove existing dynamic rules, in order their ids not interfere with new
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: existingRulesIds });
        await chrome.declarativeNetRequest.updateDynamicRules({ addRules: convertedRules });
    }

    convertRules(rules: string): DeclarativeRule[] {
        const converter = new TSUrlFilter.DeclarativeConverter();
        const list = new TSUrlFilter.StringRuleList(0, rules, false);

        const convertedRules = converter.convert(
            list,
            this.MAX_NUMBER_OF_RULES,
        );

        return convertedRules;
    }
}
