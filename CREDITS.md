# Credits and licences

ZTimer Web is an unofficial, free fan project released under the **GNU General Public License v3.0** (see `LICENSE.txt`).
It is not made, endorsed or sponsored by csTimer or the World Cube Association.

## csTimer (primary basis of the website)
- Authors: Shuang Chen (cs0x7f), UI designed by Yue Zhang, and contributors
- Website: https://cstimer.net/
- Source: https://github.com/cs0x7f/cstimer (contributors: https://github.com/cs0x7f/cstimer/graphs/contributors)
- Licence: GNU GPL v3.0

The website is a **modified copy of csTimer's source code** (snapshot version 2026.10.31, ZTimer Web build zt2). Everything about the interface,
timer, inspection, sessions, statistics, scramblers, scramble images, solvers and tools comes from csTimer.

### Changes made by ZTimer Web (2026, Zel / ZelCubes)
The complete change list is `ztimer-web-changes.patch` (a diff against the csTimer source). In short:
- Added three features with new code, inspired by the ZTimer Android app: quick action buttons under the timer
  (`tools/zquick.js`), a wide move notation setting Rw / r (`scramble.js`), and a WCA data tool with records,
  competitions and WCA ID lookup (`tools/wca.js`). WCA data is loaded live from the WCA public API; it is owned by the World Cube Association.
- Renamed to ZTimer Web; logo text, page title and About page changed; csTimer's affiliate links and donation widgets removed.
- Features that call csTimer's own servers were switched off: csTimer account backup, WCA and Google backup,
  online competition and online battle scramble types.
- Language switching removed (English only for now).
- Files flattened so the site can be hosted from one folder on GitHub Pages.
- After building, the path "js/twisty.js" inside cstimer.js is changed to "twisty.js" (flat file layout).
- Built with csTimer's own Makefile and Closure Compiler (`make`), without the two online tool files.

To rebuild: take the csTimer source, apply `ztimer-web-changes.patch`, run `make`, and use `dist/js/cstimer.js`,
`dist/js/twisty.js` and `src/css/style.css` with `index.html` and `en-us.js`.

## ZTimer (Android app)
- Author: Zel (ZelCubes), GPL-3.0, https://github.com/zelcubecodes/ZTimer
- Ancestors: Cubic Timer by hato-ya (https://github.com/hato-ya/CubicTimer) and
  Twisty Timer by Ari Neto (https://github.com/aricneto/TwistyTimer), both GPL-3.0.

## Third-party libraries bundled with csTimer
jQuery 1.8.0 (MIT), three.js (MIT), pnltri.js (see https://github.com/jahting/pnltri.js), isaac.js (MIT),
LZ-String (WTFPL), and the cube-solving libraries by csTimer's author. Their notices remain in csTimer's source.

## Trademarks
"csTimer" is the name of the original project and is not used as the name of this site. "WCA" belongs to the World Cube Association.
