package com.hatopigeon.cubictimer.utils;

import android.graphics.Color;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * The extra (non-WCA) puzzles of the "Select a puzzle" popup. Their scrambles and pictures come
 * from csTimer's own code (see {@link CsTimer}), so every puzzle here is just a csTimer scramble
 * type with a name, csTimer's default scramble length and a colour for its icon.
 *
 * In the database and in the preferences a puzzle of this list is stored as "cs_" + csTimer's type,
 * for example "cs_888" for the 8x8 cube.
 */
public final class CsPuzzles {

    /** Put in front of csTimer's type to make the puzzle type the app stores. */
    public static final String PREFIX = "cs_";

    private CsPuzzles() {
    }

    public static final class Entry {
        /** The type the app stores ("cs_888"). */
        public final String type;
        /** csTimer's own scramble type ("888"). */
        public final String csType;
        /** The full name, shown in the puzzle popup and the header. */
        public final String name;
        /** A few characters drawn on the icon. */
        public final String label;
        /** The scramble length csTimer uses by default. */
        public final int length;
        /** False if csTimer cannot draw a picture of this puzzle. */
        public final boolean hasImage;
        public final int fillColor;
        public final int textColor;
        /** Name of the icon drawable ("ic_cs_gear"), or null to draw the label on a coloured tile. */
        public final String icon;
        /** csTimer's group of a scramble type in the "More" tab ("Relays", "4x4x4", ...), or null. */
        public final String section;
        /** The short name shown under its tile in the "More" tab. */
        public final String shortName;

        Entry(String csType, String name, String label, int length, boolean hasImage, int group, String icon) {
            this(csType, name, label, length, hasImage, group, icon, null, name);
        }

        Entry(String csType, String name, String label, int length, boolean hasImage, int group, String icon,
              String section, String shortName) {
            this.section = section;
            this.shortName = shortName;
            this.icon = icon;
            this.type = PREFIX + csType;
            this.csType = csType;
            this.name = name;
            this.label = label;
            this.length = length;
            this.hasImage = hasImage;
            this.fillColor = Color.parseColor(GROUP_FILL[group]);
            this.textColor = Color.parseColor(GROUP_TEXT[group]);
        }
    }

    // Colours of the icons, in the same pastel style as the built in puzzle icons.
    private static final int CUBE = 0, BIG = 1, MINX = 2, PUZZLE = 3, SHAPE = 4, SQUARE = 5;
    private static final String[] GROUP_FILL = {"#AACCFF", "#C9B8F2", "#FFE680", "#B8E8B8", "#FFCFA3", "#F2B8D8"};
    private static final String[] GROUP_TEXT = {"#5599FF", "#7A52C7", "#B38F00", "#3C9A3C", "#D9731A", "#C2509A"};

    private static final List<Entry> ALL;
    private static final java.util.Map<String, Entry> BY_TYPE = new java.util.HashMap<>();

    /** One more csTimer scramble type that is not listed in a tab. */
    private static void v(List<Entry> list, String section, String csType, String name, String shortName,
                          String label, int length, boolean hasImage, int color) {
        list.add(new Entry(csType, name, label, length, hasImage, color, null, section, shortName));
    }

    static {
        List<Entry> list = new ArrayList<>();
        list.add(new Entry("333ft", "3x3 Feet", "Feet", 0, true, CUBE, "ic_cs_feet"));
        list.add(new Entry("mrbl", "Mirror Blocks", "Mirror", 0, true, CUBE, "ic_cs_mirror"));
        list.add(new Entry("223", "2x2x3 Tower", "2x2x3", 0, false, SHAPE, "ic_cs_tower"));
        list.add(new Entry("233", "2x3x3 Domino", "2x3x3", 25, false, SHAPE, "ic_cs_domino"));
        list.add(new Entry("133", "Floppy Cube", "1x3x3", 0, false, SHAPE, "ic_cs_floppy"));
        list.add(new Entry("334", "3x3x4", "3x3x4", 40, false, SHAPE, "ic_cs_334"));
        list.add(new Entry("888", "8x8 Cube", "8", 120, true, CUBE, null));
        list.add(new Entry("999", "9x9 Cube", "9", 120, true, CUBE, null));
        list.add(new Entry("101010", "10x10 Cube", "10", 120, true, CUBE, null));
        list.add(new Entry("111111", "11x11 Cube", "11", 120, true, CUBE, null));
        list.add(new Entry("giga", "Gigaminx", "Giga", 300, true, MINX, "ic_cs_giga"));
        list.add(new Entry("klmp", "Kilominx", "Kilo", 30, true, MINX, "ic_cs_kilo"));
        list.add(new Entry("mpyr", "Master Pyraminx", "Master", 42, true, MINX, "ic_cs_master"));
        list.add(new Entry("sq2", "Square-2", "Sq-2", 20, true, SQUARE, "ic_cs_sq2"));
        list.add(new Entry("15prp", "15 Puzzle", "15", 0, true, PUZZLE, "ic_cs_15"));
        list.add(new Entry("8prp", "8 Puzzle", "8", 0, true, PUZZLE, "ic_cs_8"));
        list.add(new Entry("gear", "Gear Cube", "Gear", 10, true, SHAPE, "ic_cs_gear"));
        list.add(new Entry("heli", "Helicopter Cube", "Heli", 40, true, SHAPE, "ic_cs_heli"));
        list.add(new Entry("redi", "Redi Cube", "Redi", 20, true, SHAPE, "ic_cs_redi"));
        list.add(new Entry("dinoo", "Dino Cube", "Dino", 0, true, SHAPE, "ic_cs_dino"));
        list.add(new Entry("crz3a", "Crazy 3x3", "Crazy", 30, true, SHAPE, "ic_cs_crazy"));
        list.add(new Entry("ivy", "Ivy Cube", "Ivy", 10, false, SHAPE, "ic_cs_ivy"));
        // More csTimer scramble types that belong in this tab (drawn as a coloured label)
        list.add(new Entry("helicv", "Curvy Copter", "Curvy", 40, true, SHAPE, "ic_cs_curvy"));
        list.add(new Entry("r3", "Lots of 3x3s", "3x3s", 5, true, BIG, "ic_cs_r3"));
        list.add(new Entry("r234", "234 relay", "234", 0, true, BIG, "ic_cs_r234"));
        list.add(new Entry("r2345", "2345 relay", "2345", 0, true, BIG, "ic_cs_r2345"));
        list.add(new Entry("r23456", "23456 relay", "23456", 0, true, BIG, "ic_cs_r23456"));
        list.add(new Entry("r234567", "234567 relay", "2-7", 0, true, BIG, "ic_cs_r234567"));
        list.add(new Entry("rmngf", "Mini Guildford", "Guild", 0, true, BIG, "ic_cs_miniguild"));
        ALL = Collections.unmodifiableList(list);

        // The rest of csTimer's scramble types (its 3x3x3 subsets, relays, the variants of every
        // puzzle, ...), in the groups csTimer's own menu uses. The 3x3x3 training sets are in the
        // Trainer instead.
        // Not listed in the "More" tab (they are in the Trainer, or were dropped), but still known so
        // that solves saved with them keep their name and picture.
        List<Entry> hidden = new ArrayList<>();
        v(hidden, "3x3x3", "333o", "3x3x3 Random move", "Random move", "Move", 25, true, CUBE);
        v(hidden, "3x3x3", "edges", "3x3x3 Edges only", "Edges only", "Edges", 0, true, CUBE);
        v(hidden, "3x3x3", "corners", "3x3x3 Corners only", "Corners only", "Crnrs", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "2gen", "3x3x3 2-gen R,U", "2-gen R,U", "R,U", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "2genl", "3x3x3 2-gen L,U", "2-gen L,U", "L,U", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "roux", "3x3x3 Roux M,U", "Roux M,U", "M,U", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "3gen_F", "3x3x3 3-gen F,R,U", "3-gen F,R,U", "FRU", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "3gen_L", "3x3x3 3-gen R,U,L", "3-gen R,U,L", "RUL", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "RrU", "3x3x3 3-gen R,r,U", "3-gen R,r,U", "RrU", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "333drud", "3x3x3 Domino", "Domino", "DR", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "half", "3x3x3 Half turns", "Half turns", "HT", 0, true, CUBE);
        v(hidden, "3x3x3 subsets", "lsll", "3x3x3 LSLL (old)", "LSLL (old)", "LSLL", 15, true, CUBE);
        v(hidden, "2x2x2", "222o", "2x2x2 Optimal", "Optimal", "Opt", 0, true, CUBE);
        v(hidden, "2x2x2", "2223", "2x2x2 3-gen", "3-gen", "3gen", 25, true, CUBE);
        v(hidden, "2x2x2", "222eg", "2x2x2 EG", "EG", "EG", 0, true, CUBE);
        v(hidden, "2x2x2", "222eg0", "2x2x2 CLL", "CLL", "CLL", 0, true, CUBE);
        v(hidden, "2x2x2", "222eg1", "2x2x2 EG1", "EG1", "EG1", 0, true, CUBE);
        v(hidden, "2x2x2", "222eg2", "2x2x2 EG2", "EG2", "EG2", 0, true, CUBE);
        v(hidden, "2x2x2", "222tcp", "2x2x2 TCLL+", "TCLL+", "TCL+", 0, true, CUBE);
        v(hidden, "2x2x2", "222tcn", "2x2x2 TCLL-", "TCLL-", "TCL-", 0, true, CUBE);
        v(hidden, "2x2x2", "222tc", "2x2x2 TCLL", "TCLL", "TCLL", 0, true, CUBE);
        v(hidden, "2x2x2", "222lsall", "2x2x2 LS", "LS", "LS", 0, true, CUBE);
        v(hidden, "2x2x2", "222nb", "2x2x2 No bar", "No bar", "NoB", 0, true, CUBE);
        v(hidden, "2x2x2", "222easy", "2x2x2 Easy", "Easy", "Easy", 4, true, CUBE);
        v(hidden, "4x4x4", "444m", "4x4x4 Random move", "Random move", "Move", 40, true, BIG);
        v(hidden, "4x4x4", "444", "4x4x4 SiGN", "SiGN", "SiGN", 40, true, BIG);
        v(hidden, "4x4x4", "444yj", "4x4x4 YJ", "YJ", "YJ", 40, true, BIG);
        v(hidden, "4x4x4", "4edge", "4x4x4 Edges", "Edges", "Edge", 0, true, BIG);
        v(hidden, "4x4x4", "RrUu", "4x4x4 R,r,U,u", "R,r,U,u", "Rr", 40, true, BIG);
        v(hidden, "4x4x4", "444ll", "4x4x4 Last layer", "Last layer", "LL", 0, true, BIG);
        v(hidden, "4x4x4", "444ell", "4x4x4 ELL", "ELL", "ELL", 0, true, BIG);
        v(hidden, "4x4x4", "444edo", "4x4x4 Edges only", "Edges only", "Edge", 0, true, BIG);
        v(hidden, "4x4x4", "444cto", "4x4x4 Centers only", "Centers only", "Cntr", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444ctud", "4x4x4 UD centers", "UD centers", "UDc", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444ud3c", "4x4x4 UD + 3 edges", "UD + 3 edges", "UD3", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444l8e", "4x4x4 Last 8 edges", "Last 8 edges", "L8E", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444ctrl", "4x4x4 RL centers", "RL centers", "RLc", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444rlda", "4x4x4 RLDX centers", "RLDX centers", "RLDX", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444rlca", "4x4x4 RLDX cross", "RLDX cross", "RLX", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444poll", "4x4x4 POLL", "POLL", "POLL", 0, true, BIG);
        v(hidden, "4x4x4 Yau/Hoya", "444ppll", "4x4x4 PPLL", "PPLL", "PPLL", 0, true, BIG);
        v(hidden, "5x5x5", "555", "5x5x5 SiGN", "SiGN", "SiGN", 60, true, BIG);
        v(hidden, "5x5x5", "5edge", "5x5x5 Edges", "Edges", "Edge", 8, true, BIG);
        v(hidden, "6x6x6", "666si", "6x6x6 SiGN", "SiGN", "SiGN", 80, true, BIG);
        v(hidden, "6x6x6", "666p", "6x6x6 Prefix", "Prefix", "Pre", 80, true, BIG);
        v(hidden, "6x6x6", "666s", "6x6x6 Suffix", "Suffix", "Suf", 80, true, BIG);
        v(hidden, "6x6x6", "6edge", "6x6x6 Edges", "Edges", "Edge", 8, true, BIG);
        v(hidden, "7x7x7", "777si", "7x7x7 SiGN", "SiGN", "SiGN", 100, true, BIG);
        v(hidden, "7x7x7", "777p", "7x7x7 Prefix", "Prefix", "Pre", 100, true, BIG);
        v(hidden, "7x7x7", "777s", "7x7x7 Suffix", "Suffix", "Suf", 100, true, BIG);
        v(hidden, "7x7x7", "7edge", "7x7x7 Edges", "Edges", "Edge", 8, true, BIG);
        v(hidden, "Clock", "clkwcab", "Clock WCA (old)", "WCA (old)", "Old", 0, true, PUZZLE);
        v(hidden, "Clock", "clknf", "Clock No y2", "No y2", "NoY2", 0, true, PUZZLE);
        v(hidden, "Clock", "clk", "Clock Jaap", "Jaap", "Jaap", 0, true, PUZZLE);
        v(hidden, "Clock", "clko", "Clock Optimal", "Optimal", "Opt", 0, true, PUZZLE);
        v(hidden, "Clock", "clkc", "Clock Concise", "Concise", "Conc", 0, false, PUZZLE);
        v(hidden, "Clock", "clke", "Clock Efficient", "Efficient", "Eff", 0, false, PUZZLE);
        v(hidden, "Megaminx", "mgmc", "Megaminx Carrot", "Carrot", "Carr", 70, true, MINX);
        v(hidden, "Megaminx", "mgmo", "Megaminx Old style", "Old style", "Old", 70, true, MINX);
        v(hidden, "Megaminx", "minx2g", "Megaminx 2-gen R,U", "2-gen R,U", "R,U", 30, true, MINX);
        v(hidden, "Megaminx", "mlsll", "Megaminx LS + LL", "LS + LL", "LSLL", 0, true, MINX);
        v(hidden, "Megaminx", "mgmso", "Megaminx Random state", "Random state", "State", 0, true, MINX);
        v(hidden, "Megaminx", "mgmpll", "Megaminx PLL", "PLL", "PLL", 0, true, MINX);
        v(hidden, "Megaminx", "mgmll", "Megaminx Last layer", "Last layer", "LL", 0, true, MINX);
        v(hidden, "Megaminx", "mgms2l", "Megaminx S2L", "S2L", "S2L", 48, true, MINX);
        v(hidden, "Pyraminx", "pyro", "Pyraminx Optimal", "Optimal", "Opt", 0, true, MINX);
        v(hidden, "Pyraminx", "pyrm", "Pyraminx Random move", "Random move", "Move", 25, true, MINX);
        v(hidden, "Pyraminx", "pyrl4e", "Pyraminx L4E", "L4E", "L4E", 0, true, MINX);
        v(hidden, "Pyraminx", "pyr4c", "Pyraminx 4 tips", "4 tips", "Tips", 0, true, MINX);
        v(hidden, "Pyraminx", "pyrnb", "Pyraminx No bar", "No bar", "NoB", 0, true, MINX);
        v(hidden, "Skewb", "skbo", "Skewb Optimal", "Optimal", "Opt", 0, true, PUZZLE);
        v(hidden, "Skewb", "skb", "Skewb Random move", "Random move", "Move", 25, true, PUZZLE);
        v(hidden, "Skewb", "skbnb", "Skewb No bar", "No bar", "NoB", 0, true, PUZZLE);
        v(hidden, "Skewb", "skbll", "Skewb Last layer", "Last layer", "LL", 0, true, PUZZLE);
        v(hidden, "Square-1", "sqrcsp", "Square-1 CSP", "CSP", "CSP", 0, true, SQUARE);
        v(hidden, "Square-1", "sq1pll", "Square-1 PLL", "PLL", "PLL", 0, true, SQUARE);
        v(hidden, "Square-1", "sq1h", "Square-1 Face turn", "Face turn", "Face", 40, true, SQUARE);
        v(hidden, "Square-1", "sq1t", "Square-1 Twist", "Twist", "Twist", 20, true, SQUARE);
        v(hidden, "FTO", "fto", "FTO Random move", "Random move", "Move", 30, true, SHAPE);
        v(hidden, "FTO", "ftol3t", "FTO L3T", "L3T", "L3T", 0, true, SHAPE);
        v(hidden, "FTO", "ftol4t", "FTO L3T + LBT", "L3T + LBT", "L4T", 0, true, SHAPE);
        v(hidden, "FTO", "ftotcp", "FTO TCP", "TCP", "TCP", 0, true, SHAPE);
        v(hidden, "FTO", "ftoedge", "FTO Edges only", "Edges only", "Edge", 0, true, SHAPE);
        v(hidden, "FTO", "ftocent", "FTO Centers only", "Centers only", "Cntr", 0, true, SHAPE);
        v(hidden, "FTO", "ftocorn", "FTO Corners only", "Corners only", "Crnr", 0, true, SHAPE);
        v(hidden, "FTO", "dmdso", "FTO Diamond", "Diamond", "Dmd", 0, true, SHAPE);
        v(hidden, "15 puzzle", "15prap", "15 Puzzle State ^<>v", "State ^<>v", "^<>v", 0, true, PUZZLE);
        v(hidden, "15 puzzle", "15prmp", "15 Puzzle State blank", "State blank", "Blank", 0, true, PUZZLE);
        v(hidden, "15 puzzle", "15p", "15 Puzzle Move URLD", "Move URLD", "URLD", 80, true, PUZZLE);
        v(hidden, "15 puzzle", "15pat", "15 Puzzle Move ^<>v", "Move ^<>v", "^<>v", 80, true, PUZZLE);
        v(hidden, "15 puzzle", "15pm", "15 Puzzle Move blank", "Move blank", "Blank", 80, true, PUZZLE);
        v(hidden, "8 puzzle", "8prap", "8 Puzzle State ^<>v", "State ^<>v", "^<>v", 0, true, PUZZLE);
        v(hidden, "8 puzzle", "8prmp", "8 Puzzle State blank", "State blank", "Blank", 0, true, PUZZLE);
        v(hidden, "LxMxN", "335", "3x3x5", "3x3x5", "335", 25, false, SHAPE);
        v(hidden, "LxMxN", "336", "3x3x6", "3x3x6", "336", 40, false, SHAPE);
        v(hidden, "LxMxN", "337", "3x3x7", "3x3x7", "337", 40, false, SHAPE);
        v(hidden, "Gear Cube", "gearso", "Gear Cube Random state", "Random state", "State", 0, true, SHAPE);
        v(hidden, "Gear Cube", "gearo", "Gear Cube Optimal", "Optimal", "Opt", 0, true, SHAPE);
        v(hidden, "Kilominx", "klmso", "Kilominx Random state", "Random state", "State", 0, true, MINX);
        v(hidden, "Cmetrick", "cm3", "Cmetrick", "Cmetrick", "Cm", 25, false, SHAPE);
        v(hidden, "Cmetrick", "cm2", "Cmetrick Mini", "Cmetrick Mini", "Mini", 25, false, SHAPE);
        v(hidden, "Helicopter Cube", "heli2x2g", "2x2 Heli", "2x2 Heli", "2x2", 5, true, SHAPE);
        v(hidden, "Helicopter Cube", "heli2x2", "2x2 Heli", "2x2 Heli", "2x2", 70, true, SHAPE);
        v(hidden, "Redi Cube", "rediso", "Redi Cube Random state", "Random state", "State", 0, true, SHAPE);
        v(hidden, "Redi Cube", "redim", "Redi Cube MoYu", "MoYu", "MoYu", 8, true, SHAPE);
        v(hidden, "Dino Cube", "dinoso", "Dino Cube Random state", "Random state", "State", 0, true, SHAPE);
        v(hidden, "Ivy Cube", "ivyso", "Ivy Cube Random state", "Random state", "State", 0, false, SHAPE);
        v(hidden, "Ivy Cube", "ivyo", "Ivy Cube Optimal", "Optimal", "Opt", 0, false, SHAPE);
        v(hidden, "Master Pyraminx", "mpyrso", "Master Pyraminx Random state", "Random state", "State", 0, true, MINX);
        v(hidden, "Pyraminx Crystal", "prcp", "Pyraminx Crystal Pochmann", "Pochmann", "Poch", 70, true, MINX);
        v(hidden, "Pyraminx Crystal", "prco", "Pyraminx Crystal Old style", "Old style", "Old", 70, true, MINX);
        v(hidden, "Siamese Cube", "sia113", "Siamese 1x1x3 block", "1x1x3 block", "113", 25, false, SHAPE);
        v(hidden, "Siamese Cube", "sia123", "Siamese 1x2x3 block", "1x2x3 block", "123", 25, false, SHAPE);
        v(hidden, "Siamese Cube", "sia222", "Siamese 2x2x2 block", "2x2x2 block", "222", 25, false, SHAPE);
        v(hidden, "Other", "ssq1t", "Super Square-1", "Super Square-1", "SSq1", 20, false, SHAPE);
        v(hidden, "Other", "sfl", "Super Floppy", "Super Floppy", "SFl", 25, false, SHAPE);
        v(hidden, "Other", "ufo", "UFO", "UFO", "UFO", 25, false, SHAPE);
        v(hidden, "Other", "ctico", "Icosamate", "Icosamate", "Ico", 60, true, SHAPE);
        v(hidden, "Bandaged", "bic", "Bicube", "Bicube", "Bi", 30, false, SQUARE);
        v(hidden, "Bandaged", "bsq", "Square-1 /,(1,0)", "Square-1 /,(1,0)", "Bsq", 25, false, SQUARE);
        v(hidden, "Relays", "r234w", "234 relay (WCA)", "234 relay (WCA)", "234W", 0, true, BIG);
        v(hidden, "Relays", "r2345w", "2345 relay (WCA)", "2345 relay (WCA)", "2345W", 0, true, BIG);
        v(hidden, "Relays", "r23456w", "23456 relay (WCA)", "23456 relay (WCA)", "2-6W", 0, true, BIG);
        v(hidden, "Relays", "r234567w", "234567 relay (WCA)", "234567 relay (WCA)", "2-7W", 0, true, BIG);
        v(hidden, "Jokes", "111", "1x1x1", "1x1x1", "1", 25, false, PUZZLE);
        v(hidden, "Jokes", "-1", "-1x-1x-1", "-1x-1x-1", "-1", 25, false, PUZZLE);
        v(hidden, "Jokes", "112", "1x1x2", "1x1x2", "112", 25, false, PUZZLE);
        v(hidden, "Jokes", "lol", "LOL", "LOL", "LOL", 25, false, PUZZLE);
        v(hidden, "Jokes", "eide", "Derrick Eide", "Derrick Eide", "Eide", 25, false, PUZZLE);
        for (Entry e : ALL) BY_TYPE.put(e.type, e);
        for (Entry e : hidden) BY_TYPE.put(e.type, e);
    }


    /** Every extra puzzle, in the order the popup shows them. */
    public static List<Entry> all() {
        return ALL;
    }

    /** True if the puzzle type the app stores is one of the extra puzzles. */
    public static boolean isCs(String puzzleType) {
        return puzzleType != null && puzzleType.startsWith(PREFIX) && get(puzzleType) != null;
    }

    /** The extra puzzle behind a stored puzzle type, or null. */
    public static Entry get(String puzzleType) {
        return puzzleType == null ? null : BY_TYPE.get(puzzleType);
    }
}
