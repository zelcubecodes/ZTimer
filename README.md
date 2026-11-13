# Ztimer

Ztimer is an Android speedcubing app made by Zel (ZelCubes). It adds WCA Live, WCA Results, Records and competition pages to a full-featured puzzle timer, plus a trainer with csTimer's scramblers.

Source code: https://github.com/zelcubecodes/ZTimer

## License

Ztimer is free software under the **GNU General Public License v3.0**, see [LICENSE.txt](LICENSE.txt). You can use, study, change and share it under the terms of that licence. Ztimer is a **modified version of Cubic Timer** (which is a modified version of Twisty Timer), and it includes code from other GPL v3 projects listed below.

- New code in Ztimer: Copyright (C) 2026 Zel (ZelCubes)
- Cubic Timer: Copyright (C) 2023 hatoya
- Twisty Timer: Copyright (C) 2016 Ariovaldo Neto

This program comes with ABSOLUTELY NO WARRANTY. See the GPL v3 for details.

## Credits

Ztimer would not exist without the work of others. Thank you!

### Where Ztimer comes from
- **Cubic Timer** by hato-ya and contributors, https://github.com/hato-ya/CubicTimer (GPL v3). Ztimer is a fork of it.
- **Twisty Timer** by Ariovaldo Neto (Ari Neto) and contributors, https://github.com/aricneto/TwistyTimer (GPL v3). Cubic Timer is a fork of it.
- **Prisma Puzzle Timer** by Walter Souza, https://bitbucket.org/walter/puzzle-timer/overview (MIT). Credited by Twisty Timer as an inspiration.
- **PlusTimer** by Daniel Ciao, https://github.com/plusCubed/plusTimer (GPL v3).

### Scrambles, puzzles and trainer
- **csTimer** by Chen Shuang, https://github.com/cs0x7f/cstimer (GPL v3). Scramblers for the non-WCA puzzles and the trainer sets, trainer case lists, and scramble and case pictures.
- **TNoodle** by the World Cube Association, https://github.com/thewca/tnoodle-lib (GPL v3, Copyright 2022 Gregor Billing). WCA scrambles.
- **FTODrawer** by Calvin Nielson, https://github.com/Sixstringcal/FTODrawer. FTO scramble pictures.

### WCA data
- **World Cube Association**, https://www.worldcubeassociation.org: competition, results, rankings and records data (WCA website, public results export and API). All of this data belongs to the WCA.
- **WCA Live**, https://live.worldcubeassociation.org (https://github.com/thewca/wca-live): live competition results.
- **Competitor Groups** by Jonatan Kłosko, https://github.com/jonatanklosko/competitor-groups: ideas for the competition schedule and groups pages.

### Pictures and fonts
- **flag-icons** by Panayiotis Lipiridis, https://github.com/lipis/flag-icons (MIT). Country flag pictures.
- **Freepik** from Flaticon, https://www.flaticon.com/authors/freepik. Country flag icons.
- **Quicksand** font by Andrew Paglinawan (SIL Open Font License 1.1).

### Libraries
Ztimer also uses the following open source libraries. The full licence texts are in the app under About and feedback > License.

| Library | Author | License |
| --- | --- | --- |
| MPAndroidChart | Philipp Jahoda | Apache 2.0 |
| Glide | Sam Judd | BSD, part MIT and Apache 2.0 |
| Butterknife | Jake Wharton | Apache 2.0 |
| material-dialogs | Aidan Michael Follestad | MIT |
| Material Drawer | Mike Penz | Apache 2.0 |
| Material Preferences | Jens Driller | MIT |
| Material Color Picker Dialog | Simone Pessotto | MIT |
| material-sheet-fab (FAB) | Gordon Wong | MIT |
| Observable ScrollView | Soichiro Kashima | Apache 2.0 |
| AndroidSVG | Paul LeBeau (BigBadaboom) | Apache 2.0 |
| AndroidX Preference eXtended | takisoft | Apache 2.0 |
| AndroidClearChroma | Jeremy Jamet (Kunzisoft) | Apache 2.0 |
| LicensesDialog | Philip Schiffer | Apache 2.0 |
| usb-serial-for-android | Kai Morich (mik3y) | MIT |
| Android BLE Library | Nordic Semiconductor | BSD 3-Clause |
| Android BLE Scanner Compat Library | Nordic Semiconductor | BSD 3-Clause |

### Translations
Translations are done through Crowdin by the Cubic Timer community, see the Cubic Timer README below.

## Not affiliated

Ztimer is an unofficial, free fan project. It is not made, endorsed or sponsored by the World Cube Association, csTimer, Cubic Timer, Twisty Timer or any other project listed above. "WCA", "World Cube Association" and "WCA Live" belong to the World Cube Association. Rubik's Cube is a trademark of Rubik's Brand Ltd. All other names belong to their owners and are used only to say what the app works with.

---

# Original Cubic Timer README

Cubic Timer is a fork project from Twisty Timer by Ari Neto that support external stack timer.
I really appreciate Ariovaldo Neto that making original Twisty Timer.
https://github.com/aricneto/TwistyTimer

Original description of Twisty Timer is following.

> Twisty Timer is a Material Design twisty puzzle timer for Android. It uses the TNoodle library to generate scramble sequences for all current official speedsolving puzzles.  
> If you would like to add a new feature or fix something, just send a pull request.  
> Special thanks to Prisma Puzzle Timer, TNoodle and PlusTimer for being my inspirations to create this project :).

# Smart timer support
## How to connect external smart timer
Tap the Bluetooth icon and the app will scan for Bluetooth devices.
Tap the found device name/address to connect to Smart Timer.

## Supported smart timer
- Gan Smart Timer
- Gan Halo Timer Smart
- QiYi Smart Timer
- QiYi Timer Bluetooth Adapter

# Stack timer support
## How to connect external stack timer
Prepare RS232C to USB convert cable (IMPORTANT!! IT IS NOT AUDIO CABLE used by csTimer).
I recommend RS232 3.5mm Audio Jack Serial Adapter Cable used for the Intel Galileo Gen1 board. But the operation is not guaranteed.
Output voltage level of G4 stack timer is lower than the specification of RS232C. Therefore, sometimes there are compatibility problems.

## Supported stack timer
- Speed Stacks Pro Timer G5
- Speed Stacks Pro Timer G4
- Speed Stacks Pro Timer G3 (not confirmed, maybe)
- YuXin Timer V2
- Gan Halo Timer Smart
- QiYi Smart Timer

## Supported RS232C to USB converter device
It depends on usb-serial-for-android.
I confirmed USB-RS232 cable using FT232R.
(https://www.amazon.co.jp/gp/product/B08F7GVJH3/)

# About translation
[![Crowdin](https://badges.crowdin.net/cubic-timer/localized.svg)](https://crowdin.com/project/cubic-timer)

Cubic Timer uses crowdin for multilingual translation. Your cooperation in translation is greatly appreciated.
https://crowdin.com/project/cubic-timer

# How to fork this project
This project is licensed by GPL. So, you can fork this project and re-distribute/publish it as another application.
But I would like you to change application name, icon and ID to distinguish it from Cubic Timer.

# License (GNU GPL v3)

    Copyright (C) 2016  Ariovaldo Neto
    Copyright (C) 2023  hatoya

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
