# AdGuard MV3 Extension

<br/>
<div align="center">
    <img alt="AdGuard DNS" src="https://cdn.adtidy.org/website/images/adguard_main_logo.png" width="300px"/>
</div>
<br/>
<div align="center">
    <a href="https://adguard.com/">AdGuard Website</a> |
    <a href="https://reddit.com/r/Adguard">Reddit</a> |
    <a href="https://twitter.com/AdGuard">Twitter</a>
</div>
<br/>

Starting from January 2023 the old Manifest V2 extensions will be deprecated
and the only way to achieve content blocking in Chrome would be to use the new
[Manifest V3][v3timeline].

In mid-2021, we started working on the prototype of a new extension that would
be able to block ads even within the strict limits of Manifest V3. The task was
not easy, but we're finally able to present the first working prototype of an
MV3-enabled ad blocker.

The prototype is fully functional and if you're not a power-user, you may feel
little difference with the existing MV2-blockers. Unfortunately, this does not
mean that everything is great and we suggest you to read the [blog post][blog]
to learn about all the limitations.

* [Install the extension][install]
* [Read the blog post about it][blog]

[v3timeline]: https://developer.chrome.com/blog/mv2-transition/
[install]: https://agrd.io/adguard_mv3
[blog]: https://agrd.io/blogpost_mv3

## How to build

## Requirements

* `nodejs` - **only version 16**.
* `yarn` - nodejs package manager.

### Prepare

* `yarn install` - install necessary dependencies.
* `yarn filters` - download the latest versions of the filter lists built-in the
  extension and convert them to declarative format.

### Build

* `yarn release` - release build.
* `yarn dev` - dev build.
* `yarn dev --watch` - prepare the dev build and monitor the files for changes.
  Note, that this command will not run filters conversion, you'll need to do it
  manually.

### For Filters Maintainers

Some of the extension capabilities are only available when you install it as an
"unpacked" extension. Also, if you want to test how it works with a different
version of your filter, you need to make changes to your list manually and then
rebuild & reload the extension.

So here's what you need to do:
1. Build the extension with `yarn dev chrome --watch`.
2. Go to `chrome://extensions`, enable "Developer mode", click "Load unpacked"
   and choose the newly built extension (it will be located in
   `build/dev/chrome`).
3. In order to see how it works, open Chrome's Developer Tools and switch to the
   "AdGuard" tab. Refresh the page to see what has been blocked and by which
   rule.
4. Let's try changing something. For instance, you may want to change the Base
   list. Open `src/filters/chrome/filter_1.txt` and implement your changes.
5. Run `yarn filters-convert` to prepare the static lists.
6. Since you're running with `--watch`, the extension will be re-built
   automatically, but you still need to reload the extension in Chrome. You will
   also need to reload the "AdGuard" tab in Dev Tools or simply reopen Dev Tools
   to make it work.

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

## Dependencies
1. `nodejs` - https://nodejs.org/en/download/, **only version 16**
2. `yarn`, nodejs package manager - https://classic.yarnpkg.com/lang/en/docs/install
