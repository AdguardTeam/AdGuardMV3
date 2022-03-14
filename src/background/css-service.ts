import * as TSUrlFilter from '@adguard/tsurlfilter';
import { CosmeticRule } from '@adguard/tsurlfilter';

/**
 * Builds stylesheet from rules
 *
 * @param elemhideRules
 * @param injectRules
 * @param groupElemhideSelectors
 * @return {[]}
 */
const buildStyleSheet = (
    elemhideRules: TSUrlFilter.CosmeticRule[],
    injectRules: TSUrlFilter.CosmeticRule[],
    groupElemhideSelectors: boolean,
) => {
    const CSS_SELECTORS_PER_LINE = 50;
    const ELEMHIDE_CSS_STYLE = ' { display: none!important; }\r\n';

    const elemhides = [];

    let selectorsCount = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const selector of elemhideRules) {
        selectorsCount += 1;

        elemhides.push(selector.getContent());

        if (selectorsCount % CSS_SELECTORS_PER_LINE === 0 || !groupElemhideSelectors) {
            elemhides.push(ELEMHIDE_CSS_STYLE);
        } else {
            elemhides.push(', ');
        }
    }

    if (elemhides.length > 0) {
        // Last element should always be a style (it will replace either a comma or the same style)
        elemhides[elemhides.length - 1] = ELEMHIDE_CSS_STYLE;
    }

    const elemHideStyle = elemhides.join('');
    const cssStyle = injectRules.map((x) => x.getContent()).join('\r\n');

    const styles = [];
    if (elemHideStyle) {
        styles.push(elemHideStyle);
    }

    if (cssStyle) {
        styles.push(cssStyle);
    }

    return styles;
};

const ELEMHIDE_HIT_START = " { display: none!important; content: 'adguard";
const INJECT_HIT_START = " content: 'adguard";
const HIT_SEP = encodeURIComponent(';');
const HIT_END = "' !important;}\r\n";

/**
 * Urlencodes rule text.
 *
 * @param ruleText
 * @return {string}
 */
const escapeRule = (ruleText: string) => encodeURIComponent(ruleText)
    .replace(/['()]/g, (match) => {
        const map: { [key: string]: string } = { "'": '%27', '(': '%28', ')': '%29' };
        return map[match];
    });

/**
 * Patch rule selector adding adguard mark rule info in the content attribute
 * Example:
 * .selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}
 * @param rule
 * @returns {String}
 */
const addMarkerToElemhideRule = (rule: CosmeticRule) => {
    const result = [];
    result.push(rule.getContent());
    result.push(ELEMHIDE_HIT_START);
    result.push(rule.getFilterListId());
    result.push(HIT_SEP);
    result.push(escapeRule(rule.getText()));
    result.push(HIT_END);
    return result.join('');
};

/**
 * Patch rule selector adding adguard mark and rule info in the content attribute
 * Example:
 * .selector { color: red } -> .selector {
 * color: red, content: 'adguard{filterId};{ruleText} !important;}
 * @param rule
 * @returns {String}
 */
const addMarkerToInjectRule = (rule: CosmeticRule) => {
    const result = [];
    const ruleContent = rule.getContent();
    // if rule text has content attribute we don't add rule marker
    const contentAttributeRegex = /[{;"(]\s*content\s*:/gi;
    if (contentAttributeRegex.test(ruleContent)) {
        return ruleContent;
    }

    // remove closing brace
    const ruleTextWithoutCloseBrace = ruleContent.slice(0, -1).trim();
    // check semicolon
    const ruleTextWithSemicolon = ruleTextWithoutCloseBrace.endsWith(';')
        ? ruleTextWithoutCloseBrace
        : `${ruleTextWithoutCloseBrace};`;
    result.push(ruleTextWithSemicolon);
    result.push(INJECT_HIT_START);
    result.push(rule.getFilterListId());
    result.push(HIT_SEP);
    result.push(escapeRule(rule.getText()));
    result.push(HIT_END);

    return result.join('');
};

/**
 * Builds stylesheet with css-hits marker
 *
 * @param elemhideRules
 * @param injectRules
 * @return {*[]}
 */
const buildStyleSheetHits = (elemhideRules: CosmeticRule[], injectRules: CosmeticRule[]) => {
    const elemhideStyles = elemhideRules.map((x) => addMarkerToElemhideRule(x));
    const injectStyles = injectRules.map((x) => addMarkerToInjectRule(x));

    return [...elemhideStyles, ...injectStyles];
};

export const cssService = {
    buildStyleSheet,
    buildStyleSheetHits,
};
