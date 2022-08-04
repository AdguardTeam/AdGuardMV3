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

Convert filters into declarative rules:
```
yarn filters convert
```

## TODO
- [ ] enable disable blocking from popup
- [ ] set filter ids on site report
- [ ] handle clicks on links to subscribe to new filters
- [ ] notifications module to notify users about errors or successes
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
- [Tests](http://testcases.adguard.com/) may fail due to delayed injection of cosmetic rules
- $badfilter doesn't work in MV3, you should manual toggle "bad filters" in the settings to turn them off or leave their .txt files empty

## How to build, run and test (for developers)
Filters currently in use are placed in the path 'src/filters/chrome'

### Edit static filters
For change filters list, go to 'src/common/constants/filters.ts'

For a single test:
1. Run `yarn filters convert`
2. Run `yarn dev chrome`
3. Reload extension on the `chrome://extensions/`

If you want to continuous edit&test filters after that, you can do different:
1. Run `yarn dev chrome --watch`
2. In second terminal, but the same root project directory run `yarn filters conver` right after you done with editing filters and want to test results
3. Reload extension on the `chrome://extensions/`

### List of id's and name's of static filters:
1. Russian
2. Block ads (base English filter)
3. Block trackers
4. Block social widgets
6. German
7. Japanese
8. Dutch
9. Spanish
13. Turkish
14. Block annoyances
16. French
224. Chinese

### Update filters
Do the following:
1. `yarn filters update`
2. `yarn filters convert`
3. `yarn dev chrome`
3. Reload extension on the `chrome://extensions/`

## Debugging declarative rules
1. Clone this repository
2. Run `yarn dev chrome --watch` (or `beta`/`release` instead of `dev`)
3. Go to `chrome://extensions/` and install extension from folder `build`
3.1. Enable Developer's mode in the right top corner
3.2. Install unpacked extension
4. After install open some website
5. Open the developer tools in Chrome and click on the AdGuard tab in the right corner
6. There will be all matched requests that has been blocked by Declarative Rules, with all available information about each request, included source JSON-declarative rule and text plain rule


## Dependencies
1. `nodejs` - https://nodejs.org/en/download/, **only 16 version**
2. `yarn`, nodejs packages manager - https://classic.yarnpkg.com/lang/en/docs/install
