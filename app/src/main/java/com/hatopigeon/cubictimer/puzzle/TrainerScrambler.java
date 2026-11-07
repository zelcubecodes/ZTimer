package com.hatopigeon.cubictimer.puzzle;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.text.TextUtils;
import android.util.Log;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.items.Algorithm;
import com.hatopigeon.cubictimer.utils.AlgUtils;
import com.hatopigeon.cubictimer.utils.CsCases;
import com.hatopigeon.cubictimer.utils.CsTimer;
import com.hatopigeon.cubictimer.utils.CubeNet;
import com.hatopigeon.cubictimer.utils.Prefs;
import com.hatopigeon.cubictimer.utils.PuzzleUtils;

import org.worldcubeassociation.tnoodle.scrambles.InvalidScrambleException;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.worldcubeassociation.tnoodle.puzzle.CubePuzzle;
import org.worldcubeassociation.tnoodle.puzzle.ThreeByThreeCubePuzzle;

/**
 * Provides scramble algorithms to be used in the trainer
 */
public abstract class TrainerScrambler {
    // The algorithms were taken from
    // github.com/Roman-/oll_trainer TODO: credit them in the app
    private static Random random = new Random();

    private static String[] Y_ROTATIONS = {"", "y", "y2", "y'"};

    private static CubePuzzle puzzle = new ThreeByThreeCubePuzzle();
    private static CubePuzzle.CubeState solved = puzzle.getSolvedState();

    private TrainerScrambler() {}

    // The key preceding every trainer entry.
    // The version MUST NOT be decreased, only increased, as previous users may have
    // configurations saved in a different TRAINER version that is incompatible with the current
    // implementation, causing crashes.
    public static final String KEY_TRAINER = "TRAINER_V2";

    /**
     * The practice sets. OLL and PLL are trained from a list of cases. The others are generated:
     * LL (a random last layer), ZBLL and CMLL (a last layer with a chosen corner orientation type),
     * ZBLS (the last slot of F2L, with edges oriented) and LSE (the last six edges of Roux).
     */
    public static enum TrainerSubset {
        OLL, PLL, LL, ZBLL, ZBLS, CMLL, LSE, COLL, CLL, ELL, EOLS, WVLS, VLS, TTLL, ZZLL, TWOGLL, F2L,
        // More of csTimer's 3x3x3 training scramblers (they are listed in csTimer's own groups)
        LSLL2, ZBLLX2, EOLINE, EOCROSS, EASYC, EASYXC,
        SBRX, LSEMU,
        MT3QB, MTEOLE, MTTDR, MT6CP, MTCDRLL, MTL5EP,
        TWOGEN, TWOGENL, ROUXMU, THREEGENF, THREEGENL, RRU,
        // Other puzzles' training scramblers (they are scrambled by csTimer and are not 3x3x3s)
        EDGE4, EDGE5, EDGE6, EDGE7,
        MINX2GEN, MLSLL, MGMPLL, MGMLL, MGMS2L,
        PYRL4E, PYR4C, PYRNB,
        SKBNB, SKBLL
    };

    /** A generated practice case. */
    public static final class TrainerCase {
        /** The scramble that produces the case. */
        public final String scramble;
        /** The case that was picked (for example "OLL 21" or "Ua"), or null. */
        public final String caseName;
        /** The group the case belongs to, used as the category its solves are saved under. */
        public final String group;

        TrainerCase(String scramble, String caseName, String group) {
            this.scramble = scramble;
            this.caseName = caseName;
            this.group = group;
        }
    }

    /**
     * Saves selected cases to preferences, to be fetched later
     * Preference will be saved in the format:
     *      key: TRAINER[SUBSET][CATEGORY]
     *      set: ITEMS
     */
    public static void saveSelectedItems(TrainerSubset subset, String category, Set<String> selectedItems) {
        Prefs.getPrefs().edit()
                .putStringSet(KEY_TRAINER + subset.name() + category, selectedItems)
                .apply();
    }

    /**
     * Saves selected cases to preferences, to be fetched later. Accepts a List<String> input.
     * Preference will be saved in the format:
     *      key: TRAINER[SUBSET][CATEGORY]
     *      set: ITEMS
     */
    public static void saveSelectedItems(TrainerSubset subset, String category, List<String> selectedItems) {
        saveSelectedItems(subset, category, new HashSet<>(selectedItems));
    }

    /**
     * Utility function to rename a Trainer category, maintaining trainer subsets
     * @param subset
     * @param oldCategoryName
     * @param newCategoryName
     */
    public static void renameCategory(TrainerSubset subset, String oldCategoryName, String newCategoryName) {
        Set<String> items = fetchSelectedItems(subset, oldCategoryName);
        Prefs.getPrefs().edit().remove(KEY_TRAINER + subset.name() + oldCategoryName).apply();
        saveSelectedItems(subset, newCategoryName, items);
    }

    /**
     * Fetches previously selected cases depending on current subset and category
     * @param subset
     * @param category
     * @return
     */
    public static Set<String> fetchSelectedItems(TrainerSubset subset, String category) {
        String key = KEY_TRAINER + subset.name() + category;
        // A generated set has only a few cases, so until the user chooses, all of them are on.
        if (!TrainerSets.isAlgBased(subset) && !Prefs.getPrefs().contains(key)) {
            return new HashSet<>(TrainerSets.allCases(subset));
        }
        return Prefs.getPrefs().getStringSet(key, new HashSet<>());
    }

    /**
     * Generates a random trainer case from the selected cases
     */
    public static String generateTrainerCase(Context context, TrainerSubset subset, String category) {
        return generateCase(context, subset, category).scramble;
    }

    /** Sets that can still be generated without csTimer if it fails to start. */
    private static final java.util.Set<TrainerSubset> HAS_BUILT_IN_FALLBACK = new HashSet<>(
            java.util.Arrays.asList(TrainerSubset.LL, TrainerSubset.ZBLL, TrainerSubset.ZBLS,
                    TrainerSubset.CMLL, TrainerSubset.LSE));

    private static final String[] AUF = {"", "U", "U2", "U'"};
    private static final String[] PLL_CASES = {"H", "Ua", "Ub", "Z", "Aa", "Ab", "E", "F", "Ga", "Gb",
            "Gc", "Gd", "Ja", "Jb", "Na", "Nb", "Ra", "Rb", "T", "V", "Y"};

    /**
     * Setups for last layers that have all edges oriented and one corner orientation type. Every
     * setup keeps the first two layers solved. They are taken from the trainer's own OLL data, but
     * sorted by the corner pattern they actually produce, not by the case number they were filed
     * under, because a few of those lists mix patterns.
     */
    private static final java.util.Map<String, String[]> CORNER_SETUPS = buildCornerSetups();

    private static java.util.Map<String, String[]> buildCornerSetups() {
        java.util.Map<String, String[]> map = new java.util.HashMap<>();
        map.put("H", new String[]{
                "B L2 B2 U2 B L2 B' U2 B2 L2 B'",
                "B U2 B2 R2 F D2 F D2 F2 R2 B",
                "B' U2 B U B' U' B U B' U B",
                "L U L' U L U' L' U L U2 L'",
                "L2 F D2 F' L2 U2 L2 B R2 B' L2",
                "R B2 D2 L2 D' L2 D' B2 R2 U R",
                "R B2 U' B2 U B2 U L R' U2 L'",
                "R' F2 U F2 U' F2 U' L' R U2 L",
                "R' U L U' R U' L' U' L U' L'",
                "R' U' R U' R' U R U' R' U2 R"});
        map.put("Pi", new String[]{
                "B' U' B2 L2 D F2 D F2 D2 L2 B'",
                "F L' D2 L F' U' F L' D2 L F'",
                "F U2 B F' U' L2 U' L2 U L2 B'",
                "F' U' L' U L F2 R U R' U' F'",
                "L2 R D2 L2 U R2 U L2 D2 L2 R",
                "R U2 R2 D U2 B2 U' B2 D' U' R",
                "R' D U B2 U B2 D' U2 R2 U2 R'",
                "B D' U2 R2 F2 D' L2 U' F2 D2 R2 B",
                "B F' L2 B' L2 D F2 U F2 D' L2 F",
                "B L' B' R B L2 U' L' U2 B' U' R'"});
        map.put("U", new String[]{
                "B L2 B2 F' U2 B F2 U2 F L2 F2",
                "F L F' U' F L' F' U' L U2 L'",
                "F' R' F U F' R F U R' U2 R",
                "F2 R2 F' D F D' R2 D F' D' F'",
                "L B' R2 B' L B R2 B' L' B2 L'",
                "L D R' F2 R D' L' U2 L' U' L",
                "R' D R2 U2 R' U R U R2 D' R",
                "B L' B2 L2 B U' B' F' L F L2 B",
                "F U2 B' U2 B U2 B' R2 B' R2 B2 F'",
                "L' B' L' U2 R' U' L R B L' U2 L2"});
        map.put("T", new String[]{
                "B2 F2 L' F' R' F L F' R B2 F'",
                "L2 R' U L2 U' R D F2 U' F2 D'",
                "R U2 F U F' U R' U F U F'",
                "R2 U2 B2 L' B2 L U2 B2 R B2 R",
                "B' D' U L D' L' U' L D L' D B",
                "B' U' B' D' F D B D' F' D U B",
                "F D U' R D R' U R D' R' D' F'",
                "F D2 L F' L' B' L F L' B D2 F'",
                "F U F' U2 L' B' U' B L2 F' L' F",
                "F U F2 U' F' L F U F2 U' F' L'"});
        map.put("L", new String[]{
                "B F' D' B' D F' D' B D B' F2",
                "B L F' L F L2 U L U' L' B'",
                "B' D2 F2 D F' R2 F' D2 B' D' B2",
                "B' D2 L D R' D' L' D R D B",
                "B2 R2 D' R' U2 R D R' U2 R' B2",
                "F L F' U2 F L' F' U' L U' L'",
                "F R U R' F' L' U L F U' F'",
                "F U F' U R' U F U F' U' R",
                "F U' R' U' R U F' U' R' U R",
                "F' L' U' L U L2 B L B' L F"});
        map.put("Sune", new String[]{
                "B U2 B2 U' B2 U' B' U B' U B",
                "B' R U R2 U R2 U2 R2 U R B",
                "F2 L2 F' U2 F' U' F U' F L2 F2",
                "L R B' L B R B' L' B L' R2",
                "L R' U' R U R' F2 R' F2 L' R2",
                "L U L' U L' U' L2 U' L2 U2 L",
                "L2 R' F2 L' F2 L' U L U' L' R",
                "R' F R U F' U' F' U L F L'",
                "B D F' D' L2 D F2 U' F' D' U B'",
                "B D2 B2 F2 D2 U2 B F2 U' B U' B'"});
        map.put("Anti-Sune", new String[]{
                "B U R' U2 R U R' U R U B'",
                "B' F U F' U' F R2 F R2 B F2",
                "B' F2 R' B' R F' R' B R B F'",
                "B' U' B U' B U B2 U B2 U2 B'",
                "F U F2 U' F2 U' F2 U2 F2 U2 F'",
                "L R' F L F' R' F L' F' L' R2",
                "L R' F2 R' F2 L' R2 U R' U R",
                "L R2 B' L B R' B' L' B L' R'",
                "L' U2 L2 U L2 U L U' L U' L'",
                "B D2 U' F U F2 D' L2 D F D2 B'"});
        return map;
    }

    /**
     * The inverse of an algorithm: the moves in reverse order, each undone. The OLL and PLL lists
     * hold algorithms that SOLVE each case. To practise a case, the cube has to start in the state
     * the algorithm solves, which is what the inverse produces from a solved cube.
     */
    static String invertAlgorithm(String alg) {
        // Tokenize instead of splitting on spaces, so a missing space ("L'F'") cannot merge two moves.
        java.util.List<String> moves = CubeNet.tokenize(alg);
        StringBuilder inverse = new StringBuilder();
        for (int i = moves.size() - 1; i >= 0; i--) {
            String move = moves.get(i);
            if (move.isEmpty()) continue;
            if (move.endsWith("'")) {
                move = move.substring(0, move.length() - 1);
            } else if (!move.endsWith("2")) {
                move = move + "'";
            }
            inverse.append(move).append(' ');
        }
        return inverse.toString().trim();
    }

    private static String randomAuf() {
        return AUF[random.nextInt(4)];
    }

    private static String invertAuf(String auf) {
        switch (auf) {
            case "U":
                return "U'";
            case "U'":
                return "U";
            default:
                return auf;
        }
    }

    /** A random permutation of the last layer: a PLL setup with a U turn before and after. */
    private static String randomPermutation(Context context) {
        String pll = PLL_CASES[random.nextInt(PLL_CASES.length)];
        return randomAuf() + " " + fetchCaseAlgorithm(context, "PLL", pll) + " " + randomAuf();
    }

    /**
     * A last layer with all edges oriented and the given corner orientation type, in a random
     * permutation. This is what ZBLL (and CMLL, which ignores the edges) practises. The corner type
     * is applied after the permutation and turned by a random U move, so every position of the type
     * can come up. Passing "Oriented" gives a pure permutation with all corners oriented.
     */
    /** The corner type of a csTimer case name, for the built in generator ("Pi2-4" is "Pi"). */
    private static String fallbackCornerType(String caseName) {
        String g = com.hatopigeon.cubictimer.utils.CsCases.groupOf(caseName).replaceAll("[0-9]+$", "");
        switch (g) {
            case "S":  return "Sune";
            case "aS": return "Anti-Sune";
            case "O":  return "Oriented";
            default:   return g; // H, Pi, U, T, L
        }
    }

    private static String cornerTypeAlgorithm(Context context, String coType) {
        String alg = randomPermutation(context);
        String[] setups = CORNER_SETUPS.get(coType);
        if (setups != null) {
            String turn = randomAuf();
            alg += " " + turn + " " + setups[random.nextInt(setups.length)] + " " + invertAuf(turn);
        }
        return alg;
    }

    /**
     * Random moves that only disturb the last slot of F2L: R, U turns and R U R' style triggers.
     * The cross and the other three slots stay solved, and every edge stays oriented.
     */
    private static String lastSlotAlgorithm() {
        String[] turns = {"U", "U'", "U2"};
        StringBuilder alg = new StringBuilder();
        int triggers = 4 + random.nextInt(4);
        for (int i = 0; i < triggers; i++) {
            alg.append(randomAuf()).append(" R ").append(turns[random.nextInt(3)]).append(" R' ");
        }
        return alg.toString().trim();
    }

    /** Random M and U moves, which is all the last six edges of Roux can do. */
    private static String lseScramble() {
        String[] m = {"M", "M'", "M2"};
        String[] u = {"U", "U'", "U2"};
        StringBuilder alg = new StringBuilder();
        boolean useM = random.nextBoolean();
        int moves = 18 + random.nextInt(5);
        for (int i = 0; i < moves; i++) {
            alg.append(useM ? m[random.nextInt(3)] : u[random.nextInt(3)]).append(' ');
            useM = !useM;
        }
        return alg.toString().trim();
    }

    /**
     * Turns a setup algorithm into a scramble: puts the cube in that state and asks the solver for
     * a way to reach it. If that fails the setup itself is a valid scramble.
     */
    private static String scrambleFor(String setup, int maxMoves) {
        try {
            CubePuzzle.CubeState state = (CubePuzzle.CubeState) solved.applyAlgorithm(setup);
            String scramble = ((ThreeByThreeCubePuzzle) puzzle).solveIn(state, maxMoves, null, null);
            if (scramble != null && !scramble.trim().isEmpty()) {
                return scramble;
            }
        } catch (Exception e) {
            Log.e("TRAINER_SCRAMBLE", "Solver failed: " + e);
        }
        return setup;
    }

    /**
     * Generates a random trainer case from the selected cases, with the case and group it came from.
     * Not thread safe inside the solver, so only one case is built at a time.
     */
    public static synchronized TrainerCase generateCase(Context context, TrainerSubset subset, String category) {
        TrainerSets.setContext(context);
        List<String> selectedItems = new ArrayList<>(fetchSelectedItems(subset, category));
        // Drop choices that no longer exist (an older version listed different cases).
        if (!TrainerSets.isAlgBased(subset)) {
            selectedItems.retainAll(TrainerSets.allCases(subset));
        }
        if (selectedItems.isEmpty()) {
            return new TrainerCase(context.getString(R.string.trainer_help_message), null, null);
        }

        String caseName = pickCase(context, subset, category, selectedItems);
        String group = TrainerSets.groupOf(subset, caseName);

        // OLL and PLL are built by csTimer too, by the number of the case. This always gives the
        // case that was chosen. The algorithm based way further down is only the fallback.
        if (subset == TrainerSubset.OLL || subset == TrainerSubset.PLL) {
            int index = csOllPllIndex(context, subset, caseName);
            if (index >= 0) {
                String fromCsTimer = CsTimer.get(context).getScramble(subset == TrainerSubset.OLL ? "oll" : "pll", 0, index);
                if (fromCsTimer != null) {
                    return new TrainerCase(CubeNet.normalize(fromCsTimer), caseName, group);
                }
                Log.e("TRAINER_SCRAMBLE", "csTimer gave no OLL/PLL scramble, using the algorithm list");
            }
        }

        // Everything except OLL and PLL is scrambled by csTimer's own code.
        String csType = TrainerSets.csType(subset);
        if (csType != null) {
            String fromCsTimer = CsTimer.get(context).getScramble(csType, TrainerSets.csLength(subset), TrainerSets.csIndexOf(subset, caseName));
            if (fromCsTimer != null) {
                // Only 3x3x3 scrambles can be cleaned up by the cube simulator
                return new TrainerCase(TrainerSets.isCube(subset) ? CubeNet.normalize(fromCsTimer) : fromCsTimer.trim(), caseName, group);
            }
            Log.e("TRAINER_SCRAMBLE", "csTimer gave no scramble for " + csType);
            if (!HAS_BUILT_IN_FALLBACK.contains(subset)) {
                return new TrainerCase(context.getString(R.string.trainer_cstimer_failed), null, null);
            }
        }
        String scramble;
        boolean rotate = true;

        switch (subset) {
            case OLL:
            case PLL:
                // The lists hold solving algorithms, so start from the state each one solves.
                scramble = scrambleFor(invertAlgorithm(fetchCaseAlgorithm(context, subset.name(), caseName)), 20);
                break;
            case LL: {
                String oll = String.format(java.util.Locale.US, "OLL %02d", 1 + random.nextInt(57));
                String setup = fetchCaseAlgorithm(context, "OLL", oll) + " " + randomAuf() + " "
                        + randomPermutation(context);
                scramble = scrambleFor(setup, 22);
                break;
            }
            case ZBLL:
            case CMLL:
                scramble = scrambleFor(cornerTypeAlgorithm(context, fallbackCornerType(caseName)), 22);
                break;
            case ZBLS:
                scramble = scrambleFor(lastSlotAlgorithm(), 22);
                break;
            case LSE:
                // Already a scramble, and rotating it would turn the M slice into an S slice.
                scramble = lseScramble();
                rotate = false;
                break;
            default:
                scramble = "";
        }

        scramble = CubeNet.normalize(scramble);
        if (rotate) {
            scramble = PuzzleUtils.applyRotationForAlgorithm(scramble, Y_ROTATIONS[random.nextInt(4)]);
        }
        scramble = CubeNet.normalize(scramble);
        return new TrainerCase(scramble, caseName, group);
    }


    // ---- How the next case is picked (csTimer's "Probabilities for training-scramble states") ----

    public static final String PREF_PROBABILITY = "trainer_case_probability";
    public static final String PROB_EQUAL = "equal";
    public static final String PROB_ACTUAL = "actual";
    public static final String PROB_ORDER = "order";

    /** One of {@link #PROB_EQUAL} (default), {@link #PROB_ACTUAL} or {@link #PROB_ORDER}. */
    public static String getProbabilityMode() {
        String mode = Prefs.getPrefs().getString(PREF_PROBABILITY, PROB_EQUAL);
        return PROB_ACTUAL.equals(mode) || PROB_ORDER.equals(mode) ? mode : PROB_EQUAL;
    }

    public static void setProbabilityMode(String mode) {
        Prefs.getPrefs().edit().putString(PREF_PROBABILITY, mode).apply();
    }

    /** Cases still to come in "random order" mode, by set, category and selection. */
    private static final java.util.Map<String, List<String>> BAGS = new java.util.HashMap<>();

    private static int csOllPllIndex(Context context, TrainerSubset subset, String caseName) {
        if (subset == TrainerSubset.OLL) {
            try {
                return Integer.parseInt(caseName.replaceAll("[^0-9]", ""));
            } catch (NumberFormatException e) {
                return -1;
            }
        }
        return CsCases.names(context, "pll").indexOf(caseName);
    }

    /** csTimer's weight of a case: how many positions it stands for (1 if csTimer has no number). */
    private static int caseWeight(Context context, TrainerSubset subset, String caseName) {
        if (subset == TrainerSubset.OLL || subset == TrainerSubset.PLL) {
            int index = csOllPllIndex(context, subset, caseName);
            return CsCases.weightAt(context, subset == TrainerSubset.OLL ? "oll" : "pll", index);
        }
        String type = TrainerSets.csType(subset);
        return type == null ? 1 : CsCases.weight(context, type, caseName);
    }

    private static String pickCase(Context context, TrainerSubset subset, String category, List<String> items) {
        if (items.size() == 1) return items.get(0);
        String mode = getProbabilityMode();
        if (PROB_ORDER.equals(mode)) {
            String key = subset.name() + "|" + category + "|" + new java.util.TreeSet<>(items).toString();
            List<String> bag = BAGS.get(key);
            if (bag == null || bag.isEmpty()) {
                bag = new ArrayList<>(items);
                java.util.Collections.shuffle(bag, random);
                BAGS.put(key, bag);
            }
            return bag.remove(bag.size() - 1);
        }
        if (PROB_ACTUAL.equals(mode)) {
            int[] weights = new int[items.size()];
            int total = 0;
            for (int i = 0; i < weights.length; i++) {
                weights[i] = caseWeight(context, subset, items.get(i));
                total += weights[i];
            }
            int roll = random.nextInt(Math.max(1, total));
            for (int i = 0; i < weights.length; i++) {
                roll -= weights[i];
                if (roll < 0) return items.get(i);
            }
        }
        return items.get(random.nextInt(items.size()));
    }

    private static String fetchCaseAlgorithm(Context context, String subset, String name) {
        Resources resources = context.getResources();

        // Finds an algorithm resource with a matching name on the file trainer_scrambles.xml

        try {
            // Find the resource
            int resId = resources.getIdentifier(
                    "TRAINER_" + subset + "_" + name.replace(" ", "_").toUpperCase(),
                    "array",
                    context.getPackageName()
            );

            // Split the resouce entries
            String[] res = resources.getStringArray(resId);

            // Return one of the entries
            return res[random.nextInt(res.length)];
        } catch (Exception e) {
            Log.e("TRAINER_SCRAMBLE", "Error retrieving scramble: " + e);
        }

        return "U";
    }

}


