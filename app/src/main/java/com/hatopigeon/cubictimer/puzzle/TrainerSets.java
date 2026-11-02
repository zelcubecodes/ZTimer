package com.hatopigeon.cubictimer.puzzle;

import com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset;

import android.content.Context;

import com.hatopigeon.cubictimer.utils.CsCases;

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

    private static Context appContext;

    /** The case lists of the csTimer based sets are read from the app's assets, so they need a context. */
    public static void setContext(Context context) {
        if (context != null) appContext = context.getApplicationContext();
    }

    /**
     * The csTimer scramble type behind a set, or null for OLL and PLL (which come from the
     * algorithm database).
     */
    public static String csType(TrainerSubset subset) {
        switch (subset) {
            case LL:      return "ll";
            case ZBLL:    return "zbll";
            case ZBLS:    return "zbls";
            case CMLL:    return "cmll";
            case LSE:     return "lse";
            case COLL:    return "coll";
            case CLL:     return "cll";
            case ELL:     return "ell";
            case EOLS:    return "eols";
            case WVLS:    return "wvls";
            case VLS:     return "vls";
            case TTLL:    return "ttll";
            case ZZLL:    return "zzll";
            case TWOGLL:  return "2gll";
            case F2L:     return "f2l";
            default:      return null;
        }
    }

    /** The families the sets are sorted into, in the order they are shown. */
    public static final String[] FAMILIES = {"Last Layer", "ZB", "COLLs", "Roux", "F2L & Last Slot"};

    private static final TrainerSubset[][] FAMILY_SETS = {
            {TrainerSubset.OLL, TrainerSubset.PLL, TrainerSubset.LL, TrainerSubset.ZZLL,
                    TrainerSubset.TTLL, TrainerSubset.TWOGLL},
            {TrainerSubset.ZBLS, TrainerSubset.ZBLL},
            {TrainerSubset.COLL, TrainerSubset.CLL, TrainerSubset.ELL},
            {TrainerSubset.CMLL, TrainerSubset.LSE},
            {TrainerSubset.F2L, TrainerSubset.EOLS, TrainerSubset.WVLS, TrainerSubset.VLS}};

    /** The sets of a family, in display order. */
    public static List<TrainerSubset> setsInFamily(int family) {
        return new ArrayList<>(java.util.Arrays.asList(FAMILY_SETS[family]));
    }

    /** The name of the family a set belongs to. */
    public static String familyOf(TrainerSubset subset) {
        for (int i = 0; i < FAMILY_SETS.length; i++) {
            for (TrainerSubset t : FAMILY_SETS[i]) if (t == subset) return FAMILIES[i];
        }
        return FAMILIES[0];
    }

    /** True if csTimer lists the cases of this set one by one, so they can be chosen individually. */
    public static boolean hasCaseList(TrainerSubset subset) {
        String type = csType(subset);
        return type != null && appContext != null && !CsCases.names(appContext, type).isEmpty();
    }

    /** The picture of a case in a csTimer based set, or null if it has none. */
    public static String pictureFor(TrainerSubset subset, String caseName) {
        String type = csType(subset);
        if (type == null || appContext == null) return null;
        return CsCases.state(appContext, type, caseName);
    }

    /** The position of a case in csTimer's list for its type, or -1. */
    public static int csIndexOf(TrainerSubset subset, String caseName) {
        String type = csType(subset);
        if (type == null || appContext == null) return -1;
        return CsCases.names(appContext, type).indexOf(caseName);
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
            case TWOGLL:
                return "2GLL";
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
                                groups.add(oll("Line Shapes", 51, 52, 55, 56));
                groups.add(oll("Knight Shapes", 13, 14, 15, 16));
                groups.add(oll("L Shapes", 47, 48, 49, 50, 53, 54));
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
            default:
                addCsGroups(groups, subset);
                break;
        }
        return groups;
    }

    /**
     * The cases of a csTimer based set. Sets that csTimer lists case by case are grouped by the
     * name csTimer gives them ("H-1" and "H-2" are both in "H"); the others are one random case.
     */
    private static void addCsGroups(List<Group> groups, TrainerSubset subset) {
        String type = csType(subset);
        List<String> names = type == null || appContext == null
                ? new ArrayList<String>() : CsCases.names(appContext, type);
        if (names.isEmpty()) {
            groups.add(list(displayName(subset), randomCaseName(subset)));
            return;
        }
        java.util.LinkedHashMap<String, List<String>> byGroup = new java.util.LinkedHashMap<>();
        for (String name : names) {
            String g = CsCases.groupOf(name);
            if (!byGroup.containsKey(g)) byGroup.put(g, new ArrayList<String>());
            byGroup.get(g).add(name);
        }
        for (java.util.Map.Entry<String, List<String>> e : byGroup.entrySet()) {
            groups.add(new Group(e.getKey(), e.getValue()));
        }
    }

    /** The single case of a set that csTimer does not list case by case. */
    public static String randomCaseName(TrainerSubset subset) {
        switch (subset) {
            case LL:  return "Random LL";
            case LSE: return "Full LSE";
            default:  return "Random " + displayName(subset);
        }
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
