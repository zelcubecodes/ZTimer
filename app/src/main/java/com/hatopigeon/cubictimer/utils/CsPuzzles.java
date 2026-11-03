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

        Entry(String csType, String name, String label, int length, boolean hasImage, int group, String icon) {
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
        ALL = Collections.unmodifiableList(list);
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
        if (puzzleType == null) return null;
        for (Entry e : ALL) if (e.type.equals(puzzleType)) return e;
        return null;
    }
}
