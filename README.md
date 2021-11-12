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

## TODO
- [ ] enable disable blocking from popup
- [ ] set filter ids on site report
- [ ] handle clicks on links to subscribe to new filters
- [ ] notifications module to notify users about errors or successes
- [ ] bamboo specs
- [ ] add task to add build.txt file into build directory

## Permissions required
- `scripting` - this permission is required in order to inject assistant script only in the pages required
- `tabs` - this permission is required in order to get the url of the options page tab
