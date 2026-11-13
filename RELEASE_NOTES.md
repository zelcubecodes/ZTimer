# ZTimer v1.1 Release Notes

v1.1 is a big update: a brand-new Trainer tab, 23 new puzzles, a lot more trainers, and a smoother, faster app.

## ⚠️ Important: updating from v1.0

v1.1 is signed with a new key, so it can't be installed over v1.0. Your solves are not lost if you back them up first. Do this **before** you uninstall anything:

1. In v1.0, open **Export / Import** and choose **Export > Backup**.
2. Save the backup file somewhere safe, like your Downloads or Documents folder. Don't save it inside the app's own folder, because uninstalling the app can delete it.
3. Uninstall v1.0.
4. Install v1.1.
5. In v1.1, open **Export / Import**, choose **Import > Backup**, and pick the file you saved.

All your solves will be back, in every puzzle and category. From now on, updates install over the old version and keep your solves, so you only need to do this once.

## Moving over from Cubic Timer or Twisty Timer

Ztimer is built from Cubic Timer, which is built from Twisty Timer, so their backup files should work in Ztimer. Ztimer installs as its own app, so you can keep your old app while you move over.

1. In Cubic Timer or Twisty Timer, open **Export / Import** and choose **Export > Backup**.
2. Save the backup file somewhere you can find it, like your Downloads or Documents folder.
3. Install Ztimer.
4. In Ztimer, open **Export / Import**, choose **Import > Backup**, and pick the file you saved.

Your solves should appear in Ztimer, in the same puzzles and categories. Keep your old app and the backup file until you've checked that everything came across.

## New

### Navigation
- The bottom bar is now: **Timer, Previous solves, Stats, Trainer, WCA**.
- WCA Results and WCA Live share one **WCA** tab. The Results / Live switch sits in the main top bar. Opening a competition from Results still jumps to Live, and "open in Results" from Live still works.
- One-tap Timer/Trainer switch on the times and graph pages, next to the settings gear.

### Trainer (now its own tab)
- The Trainer has its own timer. It looks and behaves like the Timer tab (scramble row, quick actions, stats, settings).
- Pick a set from a **tile grid with one tab per group**, similar to csTimer's scramble menu.
- Long-press a set to **star** it. Starred sets get their own Starred tab and a star badge.
- Trainer solves are saved under the set's name (for example "OLL") and the group of the case you practised.
- **Case picker** with sections. Each group (for example "T Shapes") has a header with its own Select/Deselect button. "Select all" works on every set. The cases button (new checklist icon) only shows for sets that have cases to pick.
- New **Case probability** setting (Settings > Trainer): *Actual* (real probabilities), *Equal* (default), or *Random order* (every selected case once, shuffled, before repeating).
- **Categories** in the Trainer top bar (New button, long-press to rename or remove). Each category keeps its own case selection for each set.
- New training sets:
  - **CFOP:** Last Layer, ZBLL, ZBLS, CMLL, LSE, COLL, CLL, ELL, EOLS, WVLS, VLS, TTLL, ZZLL, 2GLL, F2L ("Solved Cross"), Easy Cross, Easy XCross, LSLL
  - **Roux:** 2nd Block, LSE <M,U>
  - **2x2x2:** EG, CLL, EG1, EG2, LS, No bar
  - **Big Cubes:** Big cube edges, 4x4 centres, 4x4 UD centres, 4x4 UD + 3 edges, 4x4 Last 8 edges, 4x4 POLL, 4x4 PPLL
  - **Square-1:** CSP, PLL
  - **FTO:** TCP, L3T, L3T+LBT
  - **Megaminx:** 2-gen, LS+LL, PLL, LL, S2L
  - **Pyraminx:** L4E, 4 tips, No bar
  - **Skewb:** No bar, LL
- Scrambles for every set except OLL and PLL come from csTimer's own scramble code, so the case you pick is the case you get. Case pictures use csTimer's case lists, drawn in your own cube colours.

### Puzzles
- "Select a puzzle" now has **WCA** and **Non-WCA** tabs.
- Added 23 non-WCA puzzles: 3x3 Feet, Mirror Blocks, 2x2x3 Tower, 2x3x3 Domino, Floppy Cube, 3x3x4, 8x8 to 11x11, Gigaminx, Kilominx, Master Pyraminx, Square-2, 15 Puzzle, 8 Puzzle, Gear Cube, Helicopter Cube, Redi Cube, Dino Cube, Crazy 3x3, Ivy Cube, and Curvy Copter. (Towers, dominos, floppy, 3x3x4 and Ivy have no scramble picture because csTimer can't draw them.)
- Also added relays: Lots of 3x3s, 234, 2345, 23456, 234567 and Mini Guildford.
- New custom icons for all the non-WCA puzzles and the relays.
- The popup is capped at 420dp wide so it stays compact on tablets.

### Scrambles
- New setting **Wide move notation**: *Rw* (WCA style, default) or *r* (csTimer style). It applies everywhere wide moves show: Timer, solve details and shared text. Scramble pictures work in either style.
- The next scramble is generated in the background while you solve, so it appears instantly after each solve (not used for multi-blind).
- Scramble pictures now work for M/E/S slice moves, wide moves and cube rotations.

### Stats
- On the times and graph pages, the category button lists trainer sets (for example "Training OLL") and each set's groups. Pick a whole set or a single group, such as "Training OLL · Edges Only".
- Times, graph and previous solves pages follow whichever tab you came from (Timer puzzle or Trainer set). Picking a set there also switches the Trainer.

### Design, animations and loading states
- The puzzle/trainer popup, trainer set lists and WCA page follow the CubicTimer design system: 20dp outlined cards, blue accent, 48dp touch targets.
- Star, refresh, close and play icons now share the same filled outlined style as the rest of the app.
- Animations: popups scale and fade in, tabs slide and cross-fade, taps shrink slightly, starring pops the star, refresh buttons spin, and WCA content fades in.
- Loading states: the Timer shows a spinner for "Generating scramble..." and the scramble picture pulses instead of disappearing. Rankings show pulsing placeholder rows, and already-opened rankings appear instantly and refresh behind the scenes. WCA "Loading..." and "Searching..." lines get a spinner, and competition pages show pulsing placeholder cards.

## Fixed
- The OLL and PLL trainer showed the inverse of the chosen case (for example Aa showed an Ab state). Each algorithm is now inverted first.
