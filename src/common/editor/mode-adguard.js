/* eslint-disable */
ace.define('ace/mode/css_highlight_rules', [], (require, exports, module) => {
    const oop = require('../lib/oop');
    const lang = require('../lib/lang');
    const { TextHighlightRules } = require('./text_highlight_rules');
    const supportType = exports.supportType = 'align-content|align-items|align-self|all|animation|animation-delay|animation-direction|animation-duration|animation-fill-mode|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|backface-visibility|background|background-attachment|background-blend-mode|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|border|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|bottom|box-shadow|box-sizing|caption-side|clear|clip|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|cursor|direction|display|empty-cells|filter|flex|flex-basis|flex-direction|flex-flow|flex-grow|flex-shrink|flex-wrap|float|font|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|hanging-punctuation|height|justify-content|left|letter-spacing|line-height|list-style|list-style-image|list-style-position|list-style-type|margin|margin-bottom|margin-left|margin-right|margin-top|max-height|max-width|max-zoom|min-height|min-width|min-zoom|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|order|outline|outline-color|outline-offset|outline-style|outline-width|overflow|overflow-x|overflow-y|padding|padding-bottom|padding-left|padding-right|padding-top|page-break-after|page-break-before|page-break-inside|perspective|perspective-origin|position|quotes|resize|right|tab-size|table-layout|text-align|text-align-last|text-decoration|text-decoration-color|text-decoration-line|text-decoration-style|text-indent|text-justify|text-overflow|text-shadow|text-transform|top|transform|transform-origin|transform-style|transition|transition-delay|transition-duration|transition-property|transition-timing-function|unicode-bidi|user-select|user-zoom|vertical-align|visibility|white-space|width|word-break|word-spacing|word-wrap|z-index';
    const supportFunction = exports.supportFunction = 'rgb|rgba|url|attr|counter|counters';
    const supportConstant = exports.supportConstant = 'absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero|zoom';
    const supportConstantColor = exports.supportConstantColor = 'aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen';
    const supportConstantFonts = exports.supportConstantFonts = 'arial|century|comic|courier|cursive|fantasy|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace';

    const numRe = exports.numRe = '\\-?(?:(?:[0-9]+(?:\\.[0-9]+)?)|(?:\\.[0-9]+))';
    const pseudoElements = exports.pseudoElements = '(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b';
    const pseudoClasses = exports.pseudoClasses = '(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b';

    const CssHighlightRules = function () {
        const keywordMapper = this.createKeywordMapper({
            'support.function': supportFunction,
            'support.constant': supportConstant,
            'support.type': supportType,
            'support.constant.color': supportConstantColor,
            'support.constant.fonts': supportConstantFonts,
        }, 'text', true);

        this.$rules = {
            start: [{
                include: ['strings', 'url', 'comments'],
            }, {
                token: 'paren.lparen',
                regex: '\\{',
                next: 'ruleset',
            }, {
                token: 'paren.rparen',
                regex: '\\}',
            }, {
                token: 'string',
                regex: '@(?!viewport)',
                next: 'media',
            }, {
                token: 'keyword',
                regex: '#[a-z0-9-_]+',
            }, {
                token: 'keyword',
                regex: '%',
            }, {
                token: 'variable',
                regex: '\\.[a-z0-9-_]+',
            }, {
                token: 'string',
                regex: ':[a-z0-9-_]+',
            }, {
                token: 'constant.numeric',
                regex: numRe,
            }, {
                token: 'constant',
                regex: '[a-z0-9-_]+',
            }, {
                caseInsensitive: true,
            }],

            media: [{
                include: ['strings', 'url', 'comments'],
            }, {
                token: 'paren.lparen',
                regex: '\\{',
                next: 'start',
            }, {
                token: 'paren.rparen',
                regex: '\\}',
                next: 'start',
            }, {
                token: 'string',
                regex: ';',
                next: 'start',
            }, {
                token: 'keyword',
                regex: '(?:media|supports|document|charset|import|namespace|media|supports|document'
                    + '|page|font|keyframes|viewport|counter-style|font-feature-values'
                    + '|swash|ornaments|annotation|stylistic|styleset|character-variant)',
            }],

            comments: [{
                token: 'comment', // multi line comment
                regex: '\\/\\*',
                push: [{
                    token: 'comment',
                    regex: '\\*\\/',
                    next: 'pop',
                }, {
                    defaultToken: 'comment',
                }],
            }],

            ruleset: [{
                regex: '-(webkit|ms|moz|o)-',
                token: 'text',
            }, {
                token: 'punctuation.operator',
                regex: '[:;]',
            }, {
                token: 'paren.rparen',
                regex: '\\}',
                next: 'start',
            }, {
                include: ['strings', 'url', 'comments'],
            }, {
                token: ['constant.numeric', 'keyword'],
                regex: `(${numRe})(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vmax|vmin|vm|vw|%)`,
            }, {
                token: 'constant.numeric',
                regex: numRe,
            }, {
                token: 'constant.numeric', // hex6 color
                regex: '#[a-f0-9]{6}',
            }, {
                token: 'constant.numeric', // hex3 color
                regex: '#[a-f0-9]{3}',
            }, {
                token: ['punctuation', 'entity.other.attribute-name.pseudo-element.css'],
                regex: pseudoElements,
            }, {
                token: ['punctuation', 'entity.other.attribute-name.pseudo-class.css'],
                regex: pseudoClasses,
            }, {
                include: 'url',
            }, {
                token: keywordMapper,
                regex: '\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*',
            }, {
                caseInsensitive: true,
            }],

            url: [{
                token: 'support.function',
                regex: '(?:url(:?-prefix)?|domain|regexp)\\(',
                push: [{
                    token: 'support.function',
                    regex: '\\)',
                    next: 'pop',
                }, {
                    defaultToken: 'string',
                }],
            }],

            strings: [{
                token: 'string.start',
                regex: "'",
                push: [{
                    token: 'string.end',
                    regex: "'|$",
                    next: 'pop',
                }, {
                    include: 'escapes',
                }, {
                    token: 'constant.language.escape',
                    regex: /\\$/,
                    consumeLineEnd: true,
                }, {
                    defaultToken: 'string',
                }],
            }, {
                token: 'string.start',
                regex: '"',
                push: [{
                    token: 'string.end',
                    regex: '"|$',
                    next: 'pop',
                }, {
                    include: 'escapes',
                }, {
                    token: 'constant.language.escape',
                    regex: /\\$/,
                    consumeLineEnd: true,
                }, {
                    defaultToken: 'string',
                }],
            }],
            escapes: [{
                token: 'constant.language.escape',
                regex: /\\([a-fA-F\d]{1,6}|[^a-fA-F\d])/,
            }],

        };

        this.normalizeRules();
    };

    oop.inherits(CssHighlightRules, TextHighlightRules);

    exports.CssHighlightRules = CssHighlightRules;
});

ace.define('ace/mode/doc_comment_highlight_rules', [], (require, exports, module) => {
    const oop = require('../lib/oop');
    const { TextHighlightRules } = require('./text_highlight_rules');

    var DocCommentHighlightRules = function () {
        this.$rules = {
            start: [{
                token: 'comment.doc.tag',
                regex: '@[\\w\\d_]+', // TODO: fix email addresses
            },
            DocCommentHighlightRules.getTagRule(),
            {
                defaultToken: 'comment.doc',
                caseInsensitive: true,
            }],
        };
    };

    oop.inherits(DocCommentHighlightRules, TextHighlightRules);

    DocCommentHighlightRules.getTagRule = function (start) {
        return {
            token: 'comment.doc.tag.storage.type',
            regex: '\\b(?:TODO|FIXME|XXX|HACK)\\b',
        };
    };

    DocCommentHighlightRules.getStartRule = function (start) {
        return {
            token: 'comment.doc', // doc comment
            regex: '\\/\\*(?=\\*)',
            next: start,
        };
    };

    DocCommentHighlightRules.getEndRule = function (start) {
        return {
            token: 'comment.doc', // closing comment
            regex: '\\*\\/',
            next: start,
        };
    };

    exports.DocCommentHighlightRules = DocCommentHighlightRules;
});

ace.define('ace/mode/javascript_highlight_rules', [], (require, exports, module) => {
    const oop = require('../lib/oop');
    const { DocCommentHighlightRules } = require('./doc_comment_highlight_rules');
    const { TextHighlightRules } = require('./text_highlight_rules');
    const identifierRe = '[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*';

    const JavaScriptHighlightRules = function (options) {
        const keywordMapper = this.createKeywordMapper({
            'variable.language':
                'Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|' // Constructors
                + 'Namespace|QName|XML|XMLList|' // E4X
                + 'ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|'
                + 'Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|'
                + 'Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|' // Errors
                + 'SyntaxError|TypeError|URIError|'
                + 'decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|' // Non-constructor functions
                + 'isNaN|parseFloat|parseInt|'
                + 'JSON|Math|' // Other
                + 'this|arguments|prototype|window|document', // Pseudo
            keyword:
                'const|yield|import|get|set|async|await|'
                + 'break|case|catch|continue|default|delete|do|else|finally|for|function|'
                + 'if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|'
                + '__parent__|__count__|escape|unescape|with|__proto__|'
                + 'class|enum|extends|super|export|implements|private|public|interface|package|protected|static',
            'storage.type':
                'const|let|var|function',
            'constant.language':
                'null|Infinity|NaN|undefined',
            'support.function':
                'alert',
            'constant.language.boolean': 'true|false',
        }, 'identifier');
        const kwBeforeRe = 'case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void';

        const escapedRe = '\\\\(?:x[0-9a-fA-F]{2}|' // hex
            + 'u[0-9a-fA-F]{4}|' // unicode
            + 'u{[0-9a-fA-F]{1,6}}|' // es6 unicode
            + '[0-2][0-7]{0,2}|' // oct
            + '3[0-7][0-7]?|' // oct
            + '[4-7][0-7]?|' // oct
            + '.)';

        this.$rules = {
            no_regex: [
                DocCommentHighlightRules.getStartRule('doc-start'),
                comments('no_regex'),
                {
                    token: 'string',
                    regex: "'(?=.)",
                    next: 'qstring',
                }, {
                    token: 'string',
                    regex: '"(?=.)',
                    next: 'qqstring',
                }, {
                    token: 'constant.numeric', // hexadecimal, octal and binary
                    regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/,
                }, {
                    token: 'constant.numeric', // decimal integers and floats
                    regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/,
                }, {
                    token: [
                        'storage.type', 'punctuation.operator', 'support.function',
                        'punctuation.operator', 'entity.name.function', 'text', 'keyword.operator',
                    ],
                    regex: `(${identifierRe})(\\.)(prototype)(\\.)(${identifierRe})(\\s*)(=)`,
                    next: 'function_arguments',
                }, {
                    token: [
                        'storage.type', 'punctuation.operator', 'entity.name.function', 'text',
                        'keyword.operator', 'text', 'storage.type', 'text', 'paren.lparen',
                    ],
                    regex: `(${identifierRe})(\\.)(${identifierRe})(\\s*)(=)(\\s*)(function)(\\s*)(\\()`,
                    next: 'function_arguments',
                }, {
                    token: [
                        'entity.name.function', 'text', 'keyword.operator', 'text', 'storage.type',
                        'text', 'paren.lparen',
                    ],
                    regex: `(${identifierRe})(\\s*)(=)(\\s*)(function)(\\s*)(\\()`,
                    next: 'function_arguments',
                }, {
                    token: [
                        'storage.type', 'punctuation.operator', 'entity.name.function', 'text',
                        'keyword.operator', 'text',
                        'storage.type', 'text', 'entity.name.function', 'text', 'paren.lparen',
                    ],
                    regex: `(${identifierRe})(\\.)(${identifierRe})(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()`,
                    next: 'function_arguments',
                }, {
                    token: [
                        'storage.type', 'text', 'entity.name.function', 'text', 'paren.lparen',
                    ],
                    regex: `(function)(\\s+)(${identifierRe})(\\s*)(\\()`,
                    next: 'function_arguments',
                }, {
                    token: [
                        'entity.name.function', 'text', 'punctuation.operator',
                        'text', 'storage.type', 'text', 'paren.lparen',
                    ],
                    regex: `(${identifierRe})(\\s*)(:)(\\s*)(function)(\\s*)(\\()`,
                    next: 'function_arguments',
                }, {
                    token: [
                        'text', 'text', 'storage.type', 'text', 'paren.lparen',
                    ],
                    regex: '(:)(\\s*)(function)(\\s*)(\\()',
                    next: 'function_arguments',
                }, {
                    token: 'keyword',
                    regex: "from(?=\\s*('|\"))",
                }, {
                    token: 'keyword',
                    regex: `(?:${kwBeforeRe})\\b`,
                    next: 'start',
                }, {
                    token: ['support.constant'],
                    regex: /that\b/,
                }, {
                    token: ['storage.type', 'punctuation.operator', 'support.function.firebug'],
                    regex: /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/,
                }, {
                    token: keywordMapper,
                    regex: identifierRe,
                }, {
                    token: 'punctuation.operator',
                    regex: /[.](?![.])/,
                    next: 'property',
                }, {
                    token: 'storage.type',
                    regex: /=>/,
                    next: 'start',
                }, {
                    token: 'keyword.operator',
                    regex: /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,
                    next: 'start',
                }, {
                    token: 'punctuation.operator',
                    regex: /[?:,;.]/,
                    next: 'start',
                }, {
                    token: 'paren.lparen',
                    regex: /[\[({]/,
                    next: 'start',
                }, {
                    token: 'paren.rparen',
                    regex: /[\])}]/,
                }, {
                    token: 'comment',
                    regex: /^#!.*$/,
                },
            ],
            property: [{
                token: 'text',
                regex: '\\s+',
            }, {
                token: [
                    'storage.type', 'punctuation.operator', 'entity.name.function', 'text',
                    'keyword.operator', 'text',
                    'storage.type', 'text', 'entity.name.function', 'text', 'paren.lparen',
                ],
                regex: `(${identifierRe})(\\.)(${identifierRe})(\\s*)(=)(\\s*)(function)(?:(\\s+)(\\w+))?(\\s*)(\\()`,
                next: 'function_arguments',
            }, {
                token: 'punctuation.operator',
                regex: /[.](?![.])/,
            }, {
                token: 'support.function',
                regex: /(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/,
            }, {
                token: 'support.function.dom',
                regex: /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/,
            }, {
                token: 'support.constant',
                regex: /(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/,
            }, {
                token: 'identifier',
                regex: identifierRe,
            }, {
                regex: '',
                token: 'empty',
                next: 'no_regex',
            },
            ],
            start: [
                DocCommentHighlightRules.getStartRule('doc-start'),
                comments('start'),
                {
                    token: 'string.regexp',
                    regex: '\\/',
                    next: 'regex',
                }, {
                    token: 'text',
                    regex: '\\s+|^$',
                    next: 'start',
                }, {
                    token: 'empty',
                    regex: '',
                    next: 'no_regex',
                },
            ],
            regex: [
                {
                    token: 'regexp.keyword.operator',
                    regex: '\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)',
                }, {
                    token: 'string.regexp',
                    regex: '/[sxngimy]*',
                    next: 'no_regex',
                }, {
                    token: 'invalid',
                    regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/,
                }, {
                    token: 'constant.language.escape',
                    regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/,
                }, {
                    token: 'constant.language.delimiter',
                    regex: /\|/,
                }, {
                    token: 'constant.language.escape',
                    regex: /\[\^?/,
                    next: 'regex_character_class',
                }, {
                    token: 'empty',
                    regex: '$',
                    next: 'no_regex',
                }, {
                    defaultToken: 'string.regexp',
                },
            ],
            regex_character_class: [
                {
                    token: 'regexp.charclass.keyword.operator',
                    regex: '\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)',
                }, {
                    token: 'constant.language.escape',
                    regex: ']',
                    next: 'regex',
                }, {
                    token: 'constant.language.escape',
                    regex: '-',
                }, {
                    token: 'empty',
                    regex: '$',
                    next: 'no_regex',
                }, {
                    defaultToken: 'string.regexp.charachterclass',
                },
            ],
            function_arguments: [
                {
                    token: 'variable.parameter',
                    regex: identifierRe,
                }, {
                    token: 'punctuation.operator',
                    regex: '[, ]+',
                }, {
                    token: 'punctuation.operator',
                    regex: '$',
                }, {
                    token: 'empty',
                    regex: '',
                    next: 'no_regex',
                },
            ],
            qqstring: [
                {
                    token: 'constant.language.escape',
                    regex: escapedRe,
                }, {
                    token: 'string',
                    regex: '\\\\$',
                    consumeLineEnd: true,
                }, {
                    token: 'string',
                    regex: '"|$',
                    next: 'no_regex',
                }, {
                    defaultToken: 'string',
                },
            ],
            qstring: [
                {
                    token: 'constant.language.escape',
                    regex: escapedRe,
                }, {
                    token: 'string',
                    regex: '\\\\$',
                    consumeLineEnd: true,
                }, {
                    token: 'string',
                    regex: "'|$",
                    next: 'no_regex',
                }, {
                    defaultToken: 'string',
                },
            ],
        };

        if (!options || !options.noES6) {
            this.$rules.no_regex.unshift({
                regex: '[{}]',
                onMatch(val, state, stack) {
                    this.next = val == '{' ? this.nextState : '';
                    if (val == '{' && stack.length) {
                        stack.unshift('start', state);
                    } else if (val == '}' && stack.length) {
                        stack.shift();
                        this.next = stack.shift();
                        if (this.next.indexOf('string') != -1 || this.next.indexOf('jsx') != -1) return 'paren.quasi.end';
                    }
                    return val == '{' ? 'paren.lparen' : 'paren.rparen';
                },
                nextState: 'start',
            }, {
                token: 'string.quasi.start',
                regex: /`/,
                push: [{
                    token: 'constant.language.escape',
                    regex: escapedRe,
                }, {
                    token: 'paren.quasi.start',
                    regex: /\${/,
                    push: 'start',
                }, {
                    token: 'string.quasi.end',
                    regex: /`/,
                    next: 'pop',
                }, {
                    defaultToken: 'string.quasi',
                }],
            });

            if (!options || options.jsx != false) JSX.call(this);
        }

        this.embedRules(DocCommentHighlightRules, 'doc-',
            [DocCommentHighlightRules.getEndRule('no_regex')]);

        this.normalizeRules();
    };

    oop.inherits(JavaScriptHighlightRules, TextHighlightRules);

    function JSX() {
        const tagRegex = identifierRe.replace('\\d', '\\d\\-');
        const jsxTag = {
            onMatch(val, state, stack) {
                const offset = val.charAt(1) == '/' ? 2 : 1;
                if (offset == 1) {
                    if (state != this.nextState) stack.unshift(this.next, this.nextState, 0);
                    else stack.unshift(this.next);
                    stack[2]++;
                } else if (offset == 2) {
                    if (state == this.nextState) {
                        stack[1]--;
                        if (!stack[1] || stack[1] < 0) {
                            stack.shift();
                            stack.shift();
                        }
                    }
                }
                return [{
                    type: `meta.tag.punctuation.${offset == 1 ? '' : 'end-'}tag-open.xml`,
                    value: val.slice(0, offset),
                }, {
                    type: 'meta.tag.tag-name.xml',
                    value: val.substr(offset),
                }];
            },
            regex: `</?${tagRegex}`,
            next: 'jsxAttributes',
            nextState: 'jsx',
        };
        this.$rules.start.unshift(jsxTag);
        const jsxJsRule = {
            regex: '{',
            token: 'paren.quasi.start',
            push: 'start',
        };
        this.$rules.jsx = [
            jsxJsRule,
            jsxTag,
            { include: 'reference' },
            { defaultToken: 'string' },
        ];
        this.$rules.jsxAttributes = [{
            token: 'meta.tag.punctuation.tag-close.xml',
            regex: '/?>',
            onMatch(value, currentState, stack) {
                if (currentState == stack[0]) stack.shift();
                if (value.length == 2) {
                    if (stack[0] == this.nextState) stack[1]--;
                    if (!stack[1] || stack[1] < 0) {
                        stack.splice(0, 2);
                    }
                }
                this.next = stack[0] || 'start';
                return [{ type: this.token, value }];
            },
            nextState: 'jsx',
        },
        jsxJsRule,
        comments('jsxAttributes'),
        {
            token: 'entity.other.attribute-name.xml',
            regex: tagRegex,
        }, {
            token: 'keyword.operator.attribute-equals.xml',
            regex: '=',
        }, {
            token: 'text.tag-whitespace.xml',
            regex: '\\s+',
        }, {
            token: 'string.attribute-value.xml',
            regex: "'",
            stateName: 'jsx_attr_q',
            push: [
                { token: 'string.attribute-value.xml', regex: "'", next: 'pop' },
                { include: 'reference' },
                { defaultToken: 'string.attribute-value.xml' },
            ],
        }, {
            token: 'string.attribute-value.xml',
            regex: '"',
            stateName: 'jsx_attr_qq',
            push: [
                { token: 'string.attribute-value.xml', regex: '"', next: 'pop' },
                { include: 'reference' },
                { defaultToken: 'string.attribute-value.xml' },
            ],
        },
        jsxTag,
        ];
        this.$rules.reference = [{
            token: 'constant.language.escape.reference.xml',
            regex: '(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)',
        }];
    }

    function comments(next) {
        return [
            {
                token: 'comment', // multi line comment
                regex: /\/\*/,
                next: [
                    DocCommentHighlightRules.getTagRule(),
                    { token: 'comment', regex: '\\*\\/', next: next || 'pop' },
                    { defaultToken: 'comment', caseInsensitive: true },
                ],
            }, {
                token: 'comment',
                regex: '\\/\\/',
                next: [
                    DocCommentHighlightRules.getTagRule(),
                    { token: 'comment', regex: '$|^', next: next || 'pop' },
                    { defaultToken: 'comment', caseInsensitive: true },
                ],
            },
        ];
    }
    exports.JavaScriptHighlightRules = JavaScriptHighlightRules;
});

ace.define('ace/mode/csp_highlight_rules', [], (require, exports, module) => {
    const oop = require('../lib/oop');
    const { TextHighlightRules } = require('./text_highlight_rules');

    const CspHighlightRules = function () {
        const keywordMapper = this.createKeywordMapper({
            'constant.language': 'child-src|connect-src|default-src|font-src|frame-src|img-src|manifest-src|media-src|object-src'
                + '|script-src|style-src|worker-src|base-uri|plugin-types|sandbox|disown-opener|form-action|frame-ancestors|report-uri'
                + '|report-to|upgrade-insecure-requests|block-all-mixed-content|require-sri-for|reflected-xss|referrer|policy-uri',
            variable: "'none'|'self'|'unsafe-inline'|'unsafe-eval'|'strict-dynamic'|'unsafe-hashed-attributes'",
        }, 'identifier', true);

        this.$rules = {
            start: [{
                token: 'string.link',
                regex: /https?:[^;\s,]*/,
            }, {
                token: 'operator.punctuation',
                regex: /;/,
            }, {
                token: keywordMapper,
                regex: /[^\s;,]+/,
            }],
        };
    };

    oop.inherits(CspHighlightRules, TextHighlightRules);

    exports.CspHighlightRules = CspHighlightRules;
});

ace.define('ace/mode/adguard_highlight_rules', [], (require, exports, module) => {
    const oop = require('../lib/oop');
    const { TextHighlightRules } = require('./text_highlight_rules');
    const { CssHighlightRules } = require('./css_highlight_rules');
    const { JavaScriptHighlightRules } = require('./javascript_highlight_rules');
    const { CspHighlightRules } = require('./csp_highlight_rules');

    const AdguardHighlightRules = function () {
        this.$rules = {
            start: [
                {
                    include: 'comments',
                },
                {
                    regex: /^@@/,
                    token: 'keyword.control',
                },
                {
                    regex: /#@?#\+js/,
                    next: 'javascript-start',
                    token: 'constant',
                },
                {
                    regex: /#@?\$\??#/,
                    next: 'css-start',
                    token: 'constant',
                },
                {
                    regex: /#@?\??#/,
                    next: 'elemhide-start',
                    token: 'constant',
                },
                {
                    regex: /#@?%#\/\//,
                    next: 'javascript-start',
                    token: 'constant',
                },
                {
                    regex: /#@?%#/,
                    next: 'javascript-start',
                    token: 'constant',
                },
                {
                    regex: /\$@?\$/,
                    next: 'html-filtering-start',
                    token: 'constant',
                },
                {
                    token: 'keyword.operator',
                    regex: /\||,|\^|\*|~/,
                },
                {
                    regex: /\$/,
                    next: 'options',
                    token: 'keyword.control',
                },
                {
                    defaultToken: 'markup.raw',
                },
            ],
            invalid: [
                {
                    regex: /$/,
                    next: 'start',
                    token: 'invalid',
                },
                {
                    defaultToken: 'invalid',
                },
            ],
            options: [
                {
                    regex: /$/,
                    next: 'start',
                },
                {
                    regex: /,|~|=|\|/,
                    token: 'keyword.operator',
                },
                {
                    regex: /domain=/,
                    token: 'keyword.control',
                    next: 'options_domain_app',
                },
                {
                    regex: /app=/,
                    token: 'keyword.control',
                    next: 'options_domain_app',
                },
                {
                    regex: /replace=/,
                    token: 'keyword.control',
                    next: 'options_replace',
                },
                {
                    regex: /csp=/,
                    token: 'keyword.control',
                    next: 'csp-start',
                },
                {
                    regex: /document|elemhide|content|urlblock|generichide|genericblock|jsinject|stealth/,
                    token: 'keyword.control',
                },
                {
                    regex: /third-party/,
                    token: 'keyword.control',
                },
                {
                    regex: /stylesheet|subdocument|xmlhttprequest|font|image|media|object-subrequest|object|script|other|websocket/,
                    token: 'keyword.control',
                },
                {
                    regex: /replace|empty|mp4|popup|network/,
                    token: 'keyword.control',
                },
                {
                    regex: /important|badfilter|match-case/,
                    token: 'keyword.control',
                },
                {
                    defaultToken: 'markup.raw',
                },
            ],
            options_domain_app: [
                {
                    token: 'invalid',
                    regex: /,$/,
                    next: 'start',
                },
                {
                    token: 'text',
                    regex: /$/,
                    next: 'start',
                },
                {
                    regex: /,/,
                    token: 'keyword.operator',
                    next: 'options',
                },
                {
                    defaultToken: 'string.quoted',
                },
            ],
            options_replace: [
                {
                    regex: /\/.*?\/.*\/[a-z]{0,5}/,
                    token: 'string.regexp',
                    next: 'options',
                },
            ],
            comments: [{
                token: 'comment.line',
                regex: /^!.*/,
            },
            {
                token: 'comment.line.header',
                regex: /^\[Adblock.*/,
            }, {
                token: 'comment.line.hosts',
                regex: /^# .*/,
            }],
        };
        this.embedRules(CspHighlightRules, 'csp-', [{
            token: 'text',
            regex: /$/,
            next: 'start',
        },
        {
            token: 'text',
            regex: /,/,
            next: 'options',
        }]);
        this.embedRules(CssHighlightRules, 'css-', [{
            token: 'text',
            regex: /\}?$/,
            next: 'start',
        }]);
        this.embedRules(CssHighlightRules, 'elemhide-', [{
            token: 'text',
            regex: /\}?$/,
            next: 'start',
        }, {
            token: 'invalid',
            regex: '{',
            next: 'invalid',
        }]);
        this.embedRules(CssHighlightRules, 'html-filtering-', [{
            token: 'text',
            regex: /\}?$/,
            next: 'start',
        }, {
            token: 'invalid',
            regex: '{',
            next: 'invalid',
        }]);
        this.embedRules(new JavaScriptHighlightRules({ jsx: false }).getRules(), 'javascript-', [{
            token: 'text',
            regex: /\;?$/,
            next: 'start',
        }, {
            token: 'text',
            regex: /\}?$/,
            next: 'start',
        }, {
            token: 'keyword.control',
            regex: /scriptlet/,
        }]);

        this.normalizeRules();
    };

    AdguardHighlightRules.metaData = {
        $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
        name: 'Adblock',
        scopeName: 'text.adblock',
    };

    oop.inherits(AdguardHighlightRules, TextHighlightRules);
    exports.AdguardHighlightRules = AdguardHighlightRules;
});

ace.define('ace/mode/folding/cstyle', [], (require, exports, module) => {
    const oop = require('../../lib/oop');
    const { Range } = require('../../range');
    const BaseFoldMode = require('./fold_mode').FoldMode;

    const FoldMode = exports.FoldMode = function (commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(
                this.foldingStartMarker.source.replace(/\|[^|]*?$/, `|${commentRegex.start}`),
            );
            this.foldingStopMarker = new RegExp(
                this.foldingStopMarker.source.replace(/\|[^|]*?$/, `|${commentRegex.end}`),
            );
        }
    };
    oop.inherits(FoldMode, BaseFoldMode);

    (function () {
        this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
        this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
        this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
        this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
        this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
        this._getFoldWidgetBase = this.getFoldWidget;
        this.getFoldWidget = function (session, foldStyle, row) {
            const line = session.getLine(row);

            if (this.singleLineBlockCommentRe.test(line)) {
                if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line)) return '';
            }

            const fw = this._getFoldWidgetBase(session, foldStyle, row);

            if (!fw && this.startRegionRe.test(line)) return 'start'; // lineCommentRegionStart

            return fw;
        };

        this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
            const line = session.getLine(row);

            if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);

            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;

                if (match[1]) return this.openingBracketBlock(session, match[1], row, i);

                let range = session.getCommentFoldRange(row, i + match[0].length, 1);

                if (range && !range.isMultiLine()) {
                    if (forceMultiline) {
                        range = this.getSectionRange(session, row);
                    } else if (foldStyle != 'all') range = null;
                }

                return range;
            }

            if (foldStyle === 'markbegin') return;

            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;

                if (match[1]) return this.closingBracketBlock(session, match[1], row, i);

                return session.getCommentFoldRange(row, i, -1);
            }
        };

        this.getSectionRange = function (session, row) {
            let line = session.getLine(row);
            const startIndent = line.search(/\S/);
            const startRow = row;
            const startColumn = line.length;
            row += 1;
            let endRow = row;
            const maxRow = session.getLength();
            while (++row < maxRow) {
                line = session.getLine(row);
                const indent = line.search(/\S/);
                if (indent === -1) continue;
                if (startIndent > indent) break;
                const subRange = this.getFoldWidgetRange(session, 'all', row);

                if (subRange) {
                    if (subRange.start.row <= startRow) {
                        break;
                    } else if (subRange.isMultiLine()) {
                        row = subRange.end.row;
                    } else if (startIndent == indent) {
                        break;
                    }
                }
                endRow = row;
            }

            return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
        };
        this.getCommentRegionBlock = function (session, line, row) {
            const startColumn = line.search(/\s*$/);
            const maxRow = session.getLength();
            const startRow = row;

            const re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
            let depth = 1;
            while (++row < maxRow) {
                line = session.getLine(row);
                const m = re.exec(line);
                if (!m) continue;
                if (m[1]) depth--;
                else depth++;

                if (!depth) break;
            }

            const endRow = row;
            if (endRow > startRow) {
                return new Range(startRow, startColumn, endRow, line.length);
            }
        };
    }).call(FoldMode.prototype);
});

ace.define('ace/mode/adguard', [], (require, exports, module) => {
    const oop = require('../lib/oop');
    const TextMode = require('./text').Mode;
    const { AdguardHighlightRules } = require('./adguard_highlight_rules');
    const { FoldMode } = require('./folding/cstyle');

    const Mode = function () {
        this.HighlightRules = AdguardHighlightRules;
        this.foldingRules = new FoldMode();
    };
    oop.inherits(Mode, TextMode);

    (function () {
        this.$id = 'ace/mode/adguard';
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
