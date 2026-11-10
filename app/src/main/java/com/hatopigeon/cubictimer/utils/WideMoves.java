package com.hatopigeon.cubictimer.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Writes the wide moves of a scramble in the style the person chose in the settings: "Rw" (the
 * style of the WCA and of the scramble programs the app uses) or "r" (the style csTimer used to
 * show). The setting is shared by every puzzle that has wide moves: 4x4x4 to 7x7x7, the blindfolded
 * and one handed cubes, multi blind and the 3x3x3 itself, whether the scramble was made by the app,
 * by the trainer or by csTimer. Layer numbers are kept: "3Rw" becomes "3r" and back.
 */
public final class WideMoves {

    public static final String PREF_KEY = "wide_move_notation";
    public static final String STYLE_W = "w";
    public static final String STYLE_LOWERCASE = "lowercase";

    private WideMoves() {
    }

    // "Rw", "Rw2", "Rw'", "3Rw" ...
    private static final Pattern W_STYLE = Pattern.compile("(?<![A-Za-z])(\\d*)([UDLRFB])w(?![A-Za-z])");
    // "r", "r2", "r'", "3r" ...
    private static final Pattern LOWERCASE_STYLE = Pattern.compile("(?<![A-Za-z0-9])(\\d*)([udlrfb])(?![A-Za-z])");

    /** True if the person chose the lowercase style ("r"). */
    public static boolean useLowercase() {
        try {
            return STYLE_LOWERCASE.equals(Prefs.getPrefs().getString(PREF_KEY, STYLE_W));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * The scramble with its wide moves written in the chosen style.
     *
     * @param puzzleType the puzzle the scramble is for, or null if unknown. The lowercase style is
     *                   only turned back into "Rw" for cubes, because Pyraminx tips and some other
     *                   puzzles use lowercase letters for something else.
     */
    public static String toPreferred(String scramble, String puzzleType) {
        if (scramble == null || scramble.isEmpty()) return scramble;
        return useLowercase() ? toLowercase(scramble) : (isCube(puzzleType) ? toWca(scramble) : scramble);
    }

    /** "Rw" style to "r" style. */
    public static String toLowercase(String scramble) {
        if (scramble == null) return null;
        Matcher m = W_STYLE.matcher(scramble);
        StringBuffer out = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(out, Matcher.quoteReplacement(m.group(1) + m.group(2).toLowerCase()));
        }
        m.appendTail(out);
        return out.toString();
    }

    /** "r" style to "Rw" style. Only for cube scrambles. */
    public static String toWca(String scramble) {
        if (scramble == null) return null;
        Matcher m = LOWERCASE_STYLE.matcher(scramble);
        StringBuffer out = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(out, Matcher.quoteReplacement(m.group(1) + m.group(2).toUpperCase() + "w"));
        }
        m.appendTail(out);
        return out.toString();
    }

    /** The form the scramble drawers and solvers understand, whichever style is shown. */
    public static String toCanonical(String scramble, String puzzleType) {
        return isCube(puzzleType) ? toWca(scramble) : scramble;
    }

    /** 2x2x2 to 7x7x7 in all their variants ("333oh", "444bld", "333fmc", "cs_888", ...). */
    static boolean isCube(String puzzleType) {
        if (puzzleType == null) return false;
        String t = puzzleType.startsWith("cs_") ? puzzleType.substring(3) : puzzleType;
        return t.length() >= 3 && Character.isDigit(t.charAt(0)) && Character.isDigit(t.charAt(1))
                && Character.isDigit(t.charAt(2));
    }
}
