package com.hatopigeon.cubictimer.puzzle;

import com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/**
 * What each practice set contains, and how its cases are grouped.
 *
 * OLL and PLL use the same groups as cube.academy (Solved Cross, T Shapes, Edges Only, ...). A solve
 * is saved under the group of the case that was practised, so the statistics pages can show one
 * group or the whole set. The other sets are generated rather than listed, so their cases are
 * simply their types (for ZBLL and CMLL, the corner orientation type).
 */
public final class TrainerSets {

    private TrainerSets() {
    }

    /** A named group of cases. */
    public static final class Group {
        public final String name;
        public final List<String> cases;

        Group(String name, List<String> cases) {
            this.name = name;
            this.cases = Collections.unmodifiableList(cases);
        }
    }

    /** True for the sets whose cases come from the algorithm database (they have pictures). */
    public static boolean isAlgBased(TrainerSubset subset) {
        return subset == TrainerSubset.OLL || subset == TrainerSubset.PLL;
    }

    /** Name shown to the user. */
    public static String displayName(TrainerSubset subset) {
        switch (subset) {
            case LL:
                return "Last Layer";
            default:
                return subset.name();
        }
    }

    public static List<Group> groups(TrainerSubset subset) {
        List<Group> groups = new ArrayList<>();
        switch (subset) {
            case OLL:
                groups.add(oll("Solved Cross", 21, 22, 23, 24, 25, 26, 27));
                groups.add(oll("T Shapes", 33, 45));
                groups.add(oll("Block Shapes", 5, 6));
                groups.add(oll("Edges Only", 28, 57));
                groups.add(oll("Lightning Shapes", 7, 8, 11, 12, 39, 40));
                groups.add(oll("P Shapes", 31, 32, 43, 44));
                groups.add(oll("C Shapes", 34, 46));
                groups.add(oll("Fish Shapes", 9, 10, 35, 37));
                groups.add(oll("W Shapes", 36, 38));
                groups.add(oll("Hook Shapes", 47, 48, 49, 50, 53, 54));
                groups.add(oll("Line Shapes", 51, 52, 55, 56));
                groups.add(oll("L Shapes", 13, 14, 15, 16));
                groups.add(oll("Awkward Shapes", 29, 30, 41, 42));
                groups.add(oll("Dot Cases", 1, 2, 3, 4, 17, 18, 19, 20));
                break;
            case PLL:
                groups.add(list("Edges Only", "Ua", "Ub", "H", "Z"));
                groups.add(list("Corners Only", "Aa", "Ab", "E"));
                groups.add(list("Adjacent Swap", "T", "F", "Ja", "Jb", "Ra", "Rb"));
                groups.add(list("Diagonal Swap", "Y", "Na", "Nb", "V"));
                groups.add(list("G-Perms", "Ga", "Gb", "Gc", "Gd"));
                break;
            case LL:
                groups.add(list("Last Layer", "Random LL"));
                break;
            case ZBLL:
                for (String c : CO_TYPES) groups.add(list(c, c));
                break;
            case CMLL:
                groups.add(list("Oriented", "Oriented"));
                for (String c : CO_TYPES) groups.add(list(c, c));
                break;
            case ZBLS:
                groups.add(list("ZBLS", "ZBLS"));
                break;
            case LSE:
                groups.add(list("LSE", "Full LSE"));
                break;
        }
        return groups;
    }

    /** Corner orientation types, in the order the last layer algorithm sets list them. */
    public static final String[] CO_TYPES = {"H", "Pi", "U", "T", "L", "Sune", "Anti-Sune"};

    /** The OLL case number that produces each corner orientation type with all edges oriented. */
    public static int ocllCaseFor(String coType) {
        switch (coType) {
            case "H":
                return 21;
            case "Pi":
                return 22;
            case "U":
                return 23;
            case "T":
                return 24;
            case "L":
                return 25;
            case "Anti-Sune":
                return 26;
            case "Sune":
                return 27;
        }
        return 0;
    }

    /** Every case in the set, in display order. */
    public static List<String> allCases(TrainerSubset subset) {
        List<String> all = new ArrayList<>();
        for (Group g : groups(subset)) all.addAll(g.cases);
        return all;
    }

    /** The group a case belongs to, or null if the case is unknown. */
    public static String groupOf(TrainerSubset subset, String caseName) {
        for (Group g : groups(subset)) {
            if (g.cases.contains(caseName)) return g.name;
        }
        return null;
    }

    /** The names of the groups in a set. */
    public static List<String> groupNames(TrainerSubset subset) {
        List<String> names = new ArrayList<>();
        for (Group g : groups(subset)) names.add(g.name);
        return names;
    }

    private static Group oll(String name, int... numbers) {
        List<String> cases = new ArrayList<>();
        for (int n : numbers) cases.add(String.format(Locale.US, "OLL %02d", n));
        return new Group(name, cases);
    }

    private static Group list(String name, String... cases) {
        List<String> list = new ArrayList<>();
        Collections.addAll(list, cases);
        return new Group(name, list);
    }
}
