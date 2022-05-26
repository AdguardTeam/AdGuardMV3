# Browser extension MV3

## Implementation of the browser extension with Manifest V3

## Development
To build release run:
```
yarn release
```

To build dev run:
```
yarn dev
```

Build dev for chrome run:
```
yarn dev chrome
```

Build dev for chrome in watch mode run:
```
yarn dev chrome --watch
```

Download and convert filters into declarative rules:
```
yarn filters update
```

Сonvert filters into declarative rules:
```
yarn filters сonvert
```

## TODO
- [ ] enable disable blocking from popup
- [ ] set filter ids on site report
- [ ] handle clicks on links to subscribe to new filters
- [ ] notifications module to notify users about errors or successes
- [ ] bamboo specs
- [ ] add task to add build.txt file into build directory
- [ ] apply cosmetic rules via chrome.declarativeContent https://developer.chrome.com/docs/extensions/reference/declarativeContent

## Permissions required
- `scripting` - this permission is required in order to inject assistant script only in the pages required
- `tabs` - this permission is required in order to get the url of the options page tab

## Problems
- Regexp is not supported in remove params
- We cannot implement inversion in remove params
- We cannot filter by request methods
- Only one rule applies for a redirect. For this reason, different rules with the same url may not work. Example below:
```
Works   ||testcases.adguard.com$removeparam=p1case6|p2case6

Failed  ||testcases.adguard.com$removeparam=p1case6
Works   ||testcases.adguard.com$removeparam=p2case6
```
- Script rules only work on a resource without a CSP
- [Tests](http://testcases.adguard.com/) may fail due to delayed injection of cosmetic rules

## Debugging declarative rules
Open the developer tools in Chrome and click on the AdGuard tab