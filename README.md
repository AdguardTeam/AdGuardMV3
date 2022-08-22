# Browser extension MV3

## Implementation of AdGuard Browser extension with Manifest V3

## Development
To build release, run:
```
yarn release
```

To build dev, run:
```
yarn dev
```

To build dev for Chrome, run:
```
yarn dev chrome
```

To build dev for Chrome in watch mode, run:
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

## Permissions required
- `tabs`                          - this permission is required in order to get the URL of the options page tab
- `alarms`                        - this permission is required in order to set the pause protection timer
- `contextMenus`                  - this permission is required in order to create a context menu
- `scripting`                     - this permission is required in order to inject assistant script only in the required pages
- `storage`                       - this permission is required in order to save user settings, user rules and custom filters
- `declarativeNetRequest`         - this permission is required in order to block, redirect and modify URL requests
- `declarativeNetRequestFeedback` - this permission is required in order to create a log of the blocked, redirected or modified URL requests
- `unlimitedStorage`              - this permission is required in order to save large filters
- `webNavigation`                 - this permission is required in order to catch the moment for injecting scriptlets

## Problems
- Regexp is not supported in remove params
- We cannot implement inversion in remove params
- We cannot filter by request methods
- Only one rule applies for a redirect. For this reason, different rules with the same URL may not work.

A few examples:
```
Works   ||testcases.adguard.com$removeparam=p1case6|p2case6
Failed  ||testcases.adguard.com$removeparam=p1case6
Works   ||testcases.adguard.com$removeparam=p2case6
```
- [Tests](http://testcases.adguard.com/) may fail due to delayed injection of cosmetic rules
- $badfilter doesn't work in MV3, you should manually toggle "bad filters" in the settings to turn them off or leave their .txt files empty

## How to build, run and test (for developers)
Filters currently in use are placed in the path 'src/filters/chrome'

### Edit static filters
To change the list of filters, go to 'src/common/constants/filters.ts'

For a single test:
1. Run `yarn filters convert`
2. Run `yarn dev chrome`
3. Reload the extension on `chrome://extensions/`

If you want to continuously edit & test filters after that, you can do it differently:
1. Run `yarn dev chrome --watch`
2. In the second terminal but in the same root project directory, run `yarn filters conver` right after you are done with editing filters and want to test results
3. Reload extension on `chrome://extensions/`

### List of IDs and names of static filters:
1. Russian
2. Block ads (AdGuard Base filter)
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
3. Reload extension on `chrome://extensions/`

## Debugging declarative rules
1. Clone this repository
2. Run `yarn dev chrome --watch` (or `release` instead of `dev`)
3. Go to `chrome://extensions/` and install extension from folder `build`
3.1. Enable Developer's mode in the upper right corner of your browser
3.2. Install the unpacked extension
4. After installation open any filtered website
5. Open Developer Tools in Chrome and click the AdGuard icon in the upper right corner
6. Here will be displayed all matching requests that were blocked or modified by declarative rules. You will see the full information about each request, including the source blocking rule in plain text format and the declarative rule in JSON format

## Dependencies
1. `nodejs` - https://nodejs.org/en/download/, **only version 16**
2. `yarn`, nodejs package manager - https://classic.yarnpkg.com/lang/en/docs/install
