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
            case LSLL2:   return "lsll2";
            case ZBLLX2:  return "zbllx2";
            case EOLINE:  return "eoline";
            case EOCROSS: return "eocross";
            case EASYC:   return "easyc";
            case EASYXC:  return "easyxc";
            case SBRX:    return "sbrx";
            case LSEMU:   return "lsemu";
            case MT3QB:   return "mt3qb";
            case MTEOLE:  return "mteole";
            case MTTDR:   return "mttdr";
            case MT6CP:   return "mt6cp";
            case MTCDRLL: return "mtcdrll";
            case MTL5EP:  return "mtl5ep";
            case TWOGEN:    return "2gen";
            case TWOGENL:   return "2genl";
            case ROUXMU:    return "roux";
            case THREEGENF: return "3gen_F";
            case THREEGENL: return "3gen_L";
            case RRU:       return "RrU";
            case EDGE4:     return "4edge";
            case EDGE5:     return "5edge";
            case EDGE6:     return "6edge";
            case EDGE7:     return "7edge";
            case MINX2GEN:  return "minx2g";
            case MLSLL:     return "mlsll";
            case MGMPLL:    return "mgmpll";
            case MGMLL:     return "mgmll";
            case MGMS2L:    return "mgms2l";
            case PYRL4E:    return "pyrl4e";
            case PYR4C:     return "pyr4c";
            case PYRNB:     return "pyrnb";
            case SKBNB:     return "skbnb";
            case SKBLL:     return "skbll";
            case X2EG: return "222eg";
            case X2CLL: return "222eg0";
            case X2EG1: return "222eg1";
            case X2EG2: return "222eg2";
            case X2LS: return "222lsall";
            case X2NB: return "222nb";
            case Y4UDC: return "444ctud";
            case Y4UD3: return "444ud3c";
            case Y4L8E: return "444l8e";
            case Y4POLL: return "444poll";
            case Y4PPLL: return "444ppll";
            case SQCSP: return "sqrcsp";
            case SQPLL: return "sq1pll";
            case FTOTCP: return "ftotcp";
            case FTOL3T: return "ftol3t";
            case FTOL4T: return "ftol4t";
            case Y4CTO: return "444cto";
            default:      return null;
        }
    }

    /** The scramble length csTimer needs for a set (the easy cross sets are a few moves from solved), or 0. */
    public static int csLength(TrainerSubset subset) {
        switch (subset) {
            case EASYC:  return 3;
            case EASYXC: return 4;
            case EDGE5:
            case EDGE6:
            case EDGE7:  return 8;
            case MINX2GEN: return 30;
            case MGMS2L: return 48;
            default:     return 0;
        }
    }

    /** False for the sets that are not 3x3x3s (edges of big cubes, Megaminx, Pyraminx, Skewb). */
    public static boolean isCube(TrainerSubset subset) {
        return baseType(subset).equals(com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_333);
    }

    /** The puzzle a set is on: the type its scramble picture is laid out like. */
    public static String baseType(TrainerSubset subset) {
        switch (subset) {
            case EDGE4:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_444;
            case EDGE5:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_555;
            case EDGE6:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_666;
            case EDGE7:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_777;
            case MINX2GEN:
            case MLSLL:
            case MGMPLL:
            case MGMLL:
            case MGMS2L: return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_MEGA;
            case PYRL4E:
            case PYR4C:
            case PYRNB:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_PYRA;
            case SKBNB:
            case SKBLL:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_SKEWB;
            case X2EG:
            case X2CLL:
            case X2EG1:
            case X2LS:
            case X2NB:
            case X2EG2:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_222;
            case Y4UDC:
            case Y4UD3:
            case Y4L8E:
            case Y4POLL:
            case Y4PPLL:
            case Y4CTO: return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_444;
            case SQCSP:
            case SQPLL:  return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_SQUARE1;
            case FTOTCP:
            case FTOL3T:
            case FTOL4T: return "fto";
            default:     return com.hatopigeon.cubictimer.utils.PuzzleUtils.TYPE_333;
        }
    }

    /** The few characters drawn on a set's icon. */
    public static String shortLabel(TrainerSubset subset) {
        switch (subset) {
            case TWOGLL:  return "2GLL";
            case LSLL2:   return "LSLL";
            case ZBLLX2:  return "ZBx2";
            case EOLINE:  return "EOL";
            case EOCROSS: return "EOX";
            case EASYC:   return "Easy";
            case EASYXC:  return "EasyX";
            case SBRX:    return "2BLK";
            case LSEMU:   return "MU";
            case MT3QB:   return "3QB";
            case MTEOLE:  return "EOLE";
            case MTTDR:   return "TDR";
            case MT6CP:   return "6CP";
            case MTCDRLL: return "CDRLL";
            case MTL5EP:  return "L5EP";
            case TWOGEN:    return "R,U";
            case TWOGENL:   return "L,U";
            case ROUXMU:    return "M,U";
            case THREEGENF: return "FRU";
            case THREEGENL: return "RUL";
            case RRU:       return "RrU";
            case EDGE4:     return "4E";
            case EDGE5:     return "5E";
            case EDGE6:     return "6E";
            case EDGE7:     return "7E";
            case MINX2GEN:  return "R,U";
            case MLSLL:     return "LS+LL";
            case MGMPLL:    return "PLL";
            case MGMLL:     return "LL";
            case MGMS2L:    return "S2L";
            case PYRL4E:    return "L4E";
            case PYR4C:     return "Tips";
            case PYRNB:     return "NoB";
            case SKBNB:     return "NoB";
            case SKBLL:     return "LL";
            case X2EG: return "EG";
            case X2CLL: return "CLL";
            case X2EG1: return "EG1";
            case X2EG2: return "EG2";
            case X2LS: return "LS";
            case X2NB: return "NoB";
            case Y4UDC: return "UDc";
            case Y4UD3: return "UD3";
            case Y4L8E: return "L8E";
            case Y4POLL: return "POLL";
            case Y4PPLL: return "PPLL";
            case SQCSP: return "CSP";
            case SQPLL: return "PLL";
            case FTOTCP: return "TCP";
            case FTOL3T: return "L3T";
            case FTOL4T: return "LBT";
            case Y4CTO: return "Cntr";
            default:      return subset.name();
        }
    }

    /** The groups the sets are sorted into, the same ones csTimer's scramble menu uses. */
    public static final String[] FAMILIES = {"CFOP", "Roux", "Edges", "Megaminx", "Pyraminx", "Skewb", "2x2x2", "4x4x4", "Square-1", "FTO"};

    private static final TrainerSubset[][] FAMILY_SETS = {
            // 3x3x3 CFOP
            {TrainerSubset.PLL, TrainerSubset.OLL, TrainerSubset.LSLL2, TrainerSubset.LL,
                    TrainerSubset.ZBLL, TrainerSubset.COLL, TrainerSubset.ZBLS,
                    TrainerSubset.WVLS, TrainerSubset.VLS, TrainerSubset.F2L,
                    TrainerSubset.EASYC, TrainerSubset.EASYXC,
                    TrainerSubset.TWOGEN, TrainerSubset.TWOGENL, TrainerSubset.THREEGENF,
                    TrainerSubset.THREEGENL, TrainerSubset.RRU},
            // 3x3x3 Roux
            {TrainerSubset.SBRX, TrainerSubset.CMLL, TrainerSubset.LSE, TrainerSubset.LSEMU},
            // NxNxN edges
            {TrainerSubset.EDGE5, TrainerSubset.EDGE6, TrainerSubset.EDGE7},
            // Megaminx
            {TrainerSubset.MINX2GEN, TrainerSubset.MLSLL, TrainerSubset.MGMPLL, TrainerSubset.MGMLL,
                    TrainerSubset.MGMS2L},
            // Pyraminx
            {TrainerSubset.PYRL4E, TrainerSubset.PYR4C, TrainerSubset.PYRNB},
            // Skewb
            {TrainerSubset.SKBNB, TrainerSubset.SKBLL},
            // 2x2x2
            {TrainerSubset.X2EG, TrainerSubset.X2CLL, TrainerSubset.X2EG1, TrainerSubset.X2EG2,
                    TrainerSubset.X2LS, TrainerSubset.X2NB},
            // 4x4x4
            {TrainerSubset.EDGE4, TrainerSubset.Y4CTO, TrainerSubset.Y4UDC, TrainerSubset.Y4UD3,
                    TrainerSubset.Y4L8E, TrainerSubset.Y4POLL, TrainerSubset.Y4PPLL},
            // Square-1
            {TrainerSubset.SQCSP, TrainerSubset.SQPLL},
            // FTO
            {TrainerSubset.FTOTCP, TrainerSubset.FTOL3T, TrainerSubset.FTOL4T}};

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

    /** csTimer's picture (SVG) of a case in a set that has no letter picture, or null. */
    public static String svgFor(TrainerSubset subset, String caseName) {
        String type = csType(subset);
        if (type == null || appContext == null) return null;
        return CsCases.svg(appContext, type, caseName);
    }

    /**
     * True if the set has cases to choose from: OLL and PLL, and the sets csTimer lists case by
     * case. The other sets (Last Layer, LSE, ...) are one random case, so there is nothing to pick.
     */
    public static boolean hasChoosableCases(TrainerSubset subset) {
        return isAlgBased(subset) || hasCaseList(subset);
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
            case F2L:
                return "Solved Cross";
            case ELL:
                return "Edges of Last Layer";
            case LSLL2:
                return "LSLL";
            case ZBLLX2:
                return "ZBLLx2";
            case EOLINE:
                return "EOLine";
            case EOCROSS:
                return "EO Cross";
            case EASYC:
                return "Easy Cross";
            case EASYXC:
                return "Easy XCross";
            case SBRX:
                return "2nd Block";
            case LSEMU:
                return "LSE <M, U>";
            case MT3QB:
                return "3QB";
            case MTEOLE:
                return "EOLE";
            case MTTDR:
                return "TDR";
            case MT6CP:
                return "6CP";
            case MTCDRLL:
                return "CDRLL";
            case MTL5EP:
                return "L5EP";
            case TWOGEN:
                return "2-gen R,U";
            case TWOGENL:
                return "2-gen L,U";
            case ROUXMU:
                return "Roux M,U";
            case THREEGENF:
                return "3-gen F,R,U";
            case THREEGENL:
                return "3-gen R,U,L";
            case RRU:
                return "3-gen R,r,U";
            case EDGE4:
                return "4x4x4 Edges";
            case EDGE5:
                return "5x5x5 Edges";
            case EDGE6:
                return "6x6x6 Edges";
            case EDGE7:
                return "7x7x7 Edges";
            case MINX2GEN:
                return "Minx 2-gen";
            case MLSLL:
                return "Minx LS+LL";
            case MGMPLL:
                return "Minx PLL";
            case MGMLL:
                return "Minx LL";
            case MGMS2L:
                return "Minx S2L";
            case PYRL4E:
                return "Pyra L4E";
            case PYR4C:
                return "Pyra 4 tips";
            case PYRNB:
                return "Pyra No bar";
            case SKBNB:
                return "Skewb No bar";
            case SKBLL:
                return "Skewb LL";
            case X2EG:
                return "2x2 EG";
            case X2CLL:
                return "2x2 CLL";
            case X2EG1:
                return "2x2 EG1";
            case X2EG2:
                return "2x2 EG2";
            case X2LS:
                return "2x2 LS";
            case X2NB:
                return "2x2 No bar";
            case Y4UDC:
                return "UD centers";
            case Y4UD3:
                return "UD + 3 edges";
            case Y4L8E:
                return "Last 8 edges";
            case Y4POLL:
                return "4x4 POLL";
            case Y4PPLL:
                return "4x4 PPLL";
            case SQCSP:
                return "Sq-1 CSP";
            case SQPLL:
                return "Sq-1 PLL";
            case FTOTCP:
                return "FTO TCP";
            case FTOL3T:
                return "FTO L3T";
            case FTOL4T:
                return "FTO L3T+LBT";
            case Y4CTO:
                return "4x4 Centers";
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
