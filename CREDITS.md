# Credits and licences

ZTimer Web is an unofficial, free fan project released under the **GNU General Public License v3.0** (see `LICENSE.txt`).
It is not made, endorsed or sponsored by csTimer or the World Cube Association.

## csTimer (primary basis of the website)
- Authors: Shuang Chen (cs0x7f), UI designed by Yue Zhang, and contributors
- Website: https://cstimer.net/
- Source: https://github.com/cs0x7f/cstimer (contributors: https://github.com/cs0x7f/cstimer/graphs/contributors)
- Licence: GNU GPL v3.0

The website is a **modified copy of csTimer's source code** (snapshot version 2026.10.31, ZTimer Web build zt10). Everything about the interface,
timer, inspection, sessions, statistics, scramblers, scramble images, solvers and tools comes from csTimer.

### Changes made by ZTimer Web (2026, Zel / ZelCubes)
The complete change list is `ztimer-web-changes.patch` (a diff against the csTimer source). In short:
- Added three features with new code, inspired by the ZTimer Android app: quick action buttons under the timer
  (Delete, Retry, DNF, +2, Comment; `tools/zquick.js`), a bottom navigation bar with Timer, Solves, Stats, Trainer and WCA (`tools/zbar.js`), a wide move notation setting Rw / r (`scramble.js`), and a WCA data tool with records,
  competitions and WCA ID lookup (`tools/wca.js`). WCA data is loaded live from the WCA public API; it is owned by the World Cube Association.
- Added `tools/zmigrate.js`: a one-time offer to convert solves from the first (non-csTimer) ZTimer Web into a csTimer import file.
- Added an offline/installable setup (`manifest.webmanifest`, `sw.js`). The app icon is the ZTimer Android app icon.
- Renamed to ZTimer Web; logo text, page title and About page changed; csTimer's affiliate links and donation widgets removed.
- Features that call csTimer's own servers were switched off: csTimer account backup, WCA and Google backup,
  online competition and online battle scramble types.
- Language switching removed (English only for now).
- Files flattened so the site can be hosted from one folder on GitHub Pages.
- After building, the path "js/twisty.js" inside cstimer.js is changed to "twisty.js" (flat file layout).
- Built with csTimer's own Makefile and Closure Compiler (`make`), without the two online tool files.

To rebuild: take the csTimer source, apply `ztimer-web-changes.patch`, run `make`, and use `dist/js/cstimer.js`,
`dist/js/twisty.js` and `src/css/style.css` with `index.html` and `en-us.js`.

### The ZTimer look and feel (interface layer on top of csTimer)
New files by Zel (ZelCubes), GPL-3.0, written for ZTimer Web and not part of csTimer's source: `ztimer-ui.js` (tab pages, top bar, side menu,
puzzle chooser, theme picker, add time, statistics page), `ztimer-theme.css` (colours and layout) and `ztimer-icons.css` (icons).
- Colours, the 19 colour themes, layout ideas and the tab icons come from the ZTimer Android app (GPL-3.0, by the same author).
- Icons: Material Design icons by Google (Apache License 2.0), as used in the ZTimer Android app, converted to CSS masks. A few are drawn for the app by Zel.
- Fonts (SIL Open Font License 1.1): **Quicksand** by Andrew Paglinawan (the two font files `Quicksand_Medium.ttf` and `Quicksand_Bold.ttf`, copied from the app),
  and **Lato** by Łukasz Dziedzic, loaded from Google Fonts for the timer digits (the site falls back to Quicksand when it is offline).

## ZTimer (Android app)
- Author: Zel (ZelCubes), GPL-3.0, https://github.com/zelcubecodes/ZTimer
- Ancestors: Cubic Timer by hato-ya (https://github.com/hato-ya/CubicTimer) and
  Twisty Timer by Ari Neto (https://github.com/aricneto/TwistyTimer), both GPL-3.0.

## Third-party libraries bundled with csTimer
jQuery 1.8.0 (MIT), three.js (MIT), pnltri.js (see https://github.com/jahting/pnltri.js), isaac.js (MIT),
LZ-String (WTFPL), and the cube-solving libraries by csTimer's author. Their notices remain in csTimer's source.

## Trademarks
"csTimer" is the name of the original project and is not used as the name of this site. "WCA" belongs to the World Cube Association.
