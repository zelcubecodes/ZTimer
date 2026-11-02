package com.hatopigeon.cubictimer.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * A small 3x3 simulator that understands slice moves (M, E, S), wide moves and cube rotations, and
 * can draw the result as an unfolded SVG. TNoodle's scramble drawer only reads face turns, so
 * scrambles that use the M slice (Roux's last six edges) came out with no picture at all.
 *
 * Coordinates: x is right, y is up, z is toward the front face.
 */
public final class CubeNet {

    private CubeNet() {
    }

    /** Face order used for the colours: U, L, F, R, B, D. */
    private static final int U = 0, L = 1, F = 2, R = 3, B = 4, D = 5;

    private static final class Sticker {
        int[] pos;
        int[] normal;
        final int color;

        Sticker(int[] pos, int[] normal, int color) {
            this.pos = pos;
            this.normal = normal;
            this.color = color;
        }
    }

    /**
     * Splits an algorithm into single moves, even when the spaces are missing or doubled
     * ("L'F'" becomes "L'" and "F'"). Anything that is not a move is dropped.
     */
    public static List<String> tokenize(String alg) {
        List<String> moves = new ArrayList<>();
        if (alg == null) return moves;
        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("([UDRLFB]w?|[udrlfb]|[MESxyz])(2'|'2|2|')?")
                .matcher(alg);
        while (m.find()) {
            String suffix = m.group(2) == null ? "" : m.group(2);
            if (suffix.equals("2'") || suffix.equals("'2")) suffix = "2";
            moves.add(m.group(1) + suffix);
        }
        return moves;
    }

    /** The scramble with exactly one space between moves. */
    public static String normalize(String alg) {
        StringBuilder sb = new StringBuilder();
        for (String move : tokenize(alg)) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(move);
        }
        return sb.toString();
    }

    /** True if the scramble uses anything besides plain face turns. */
    public static boolean needsOwnDrawing(String alg) {
        for (String move : tokenize(alg)) {
            char c = move.charAt(0);
            if ("MESxyz".indexOf(c) >= 0 || Character.isLowerCase(c) || move.contains("w")) return true;
        }
        return false;
    }

    private static List<Sticker> solved() {
        List<Sticker> stickers = new ArrayList<>();
        int[][] normals = {{0, 1, 0}, {-1, 0, 0}, {0, 0, 1}, {1, 0, 0}, {0, 0, -1}, {0, -1, 0}};
        for (int face = 0; face < 6; face++) {
            int[] n = normals[face];
            for (int a = -1; a <= 1; a++) {
                for (int b = -1; b <= 1; b++) {
                    int[] pos;
                    if (n[0] != 0) pos = new int[]{n[0], a, b};
                    else if (n[1] != 0) pos = new int[]{a, n[1], b};
                    else pos = new int[]{a, b, n[2]};
                    stickers.add(new Sticker(pos, n.clone(), face));
                }
            }
        }
        return stickers;
    }

    private static int dot(int[] a, int[] b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    /** Rotates v a quarter turn clockwise when looking at the cube from the tip of axis n. */
    private static int[] turn(int[] n, int[] v) {
        int d = dot(n, v);
        int[] cross = {n[1] * v[2] - n[2] * v[1], n[2] * v[0] - n[0] * v[2], n[0] * v[1] - n[1] * v[0]};
        return new int[]{d * n[0] - cross[0], d * n[1] - cross[1], d * n[2] - cross[2]};
    }

    private static void apply(List<Sticker> stickers, int[] axis, int[] layers, int quarterTurns) {
        for (Sticker s : stickers) {
            int layer = dot(axis, s.pos);
            boolean inside = false;
            for (int l : layers) if (l == layer) inside = true;
            if (!inside) continue;
            for (int i = 0; i < quarterTurns; i++) {
                s.pos = turn(axis, s.pos);
                s.normal = turn(axis, s.normal);
            }
        }
    }

    private static boolean applyMove(List<Sticker> stickers, String move) {
        char c = move.charAt(0);
        int turns = move.endsWith("2") ? 2 : move.endsWith("'") ? 3 : 1;
        boolean wide = move.contains("w") || Character.isLowerCase(c) && "udrlfb".indexOf(c) >= 0;
        char face = Character.toUpperCase(c);
        int[] all = {-1, 0, 1};
        switch (face) {
            case 'U':
                apply(stickers, new int[]{0, 1, 0}, wide ? new int[]{1, 0} : new int[]{1}, turns);
                return true;
            case 'D':
                apply(stickers, new int[]{0, -1, 0}, wide ? new int[]{1, 0} : new int[]{1}, turns);
                return true;
            case 'R':
                apply(stickers, new int[]{1, 0, 0}, wide ? new int[]{1, 0} : new int[]{1}, turns);
                return true;
            case 'L':
                apply(stickers, new int[]{-1, 0, 0}, wide ? new int[]{1, 0} : new int[]{1}, turns);
                return true;
            case 'F':
                apply(stickers, new int[]{0, 0, 1}, wide ? new int[]{1, 0} : new int[]{1}, turns);
                return true;
            case 'B':
                apply(stickers, new int[]{0, 0, -1}, wide ? new int[]{1, 0} : new int[]{1}, turns);
                return true;
            case 'M':
                apply(stickers, new int[]{-1, 0, 0}, new int[]{0}, turns);
                return true;
            case 'E':
                apply(stickers, new int[]{0, -1, 0}, new int[]{0}, turns);
                return true;
            case 'S':
                apply(stickers, new int[]{0, 0, 1}, new int[]{0}, turns);
                return true;
            case 'X':
                apply(stickers, new int[]{1, 0, 0}, all, turns);
                return true;
            case 'Y':
                apply(stickers, new int[]{0, 1, 0}, all, turns);
                return true;
            case 'Z':
                apply(stickers, new int[]{0, 0, 1}, all, turns);
                return true;
        }
        return false;
    }

    /** Which face a sticker is on right now. */
    private static int faceOf(int[] n) {
        if (n[1] == 1) return U;
        if (n[1] == -1) return D;
        if (n[0] == -1) return L;
        if (n[0] == 1) return R;
        if (n[2] == 1) return F;
        return B;
    }

    /** Row and column of a sticker inside its own 3x3 face, as seen looking at that face. */
    private static int[] cell(int face, int[] p) {
        switch (face) {
            case U: return new int[]{p[2] + 1, p[0] + 1};
            case D: return new int[]{1 - p[2], p[0] + 1};
            case F: return new int[]{1 - p[1], p[0] + 1};
            case B: return new int[]{1 - p[1], 1 - p[0]};
            case R: return new int[]{1 - p[1], 1 - p[2]};
            default: return new int[]{1 - p[1], p[2] + 1};
        }
    }

    /**
     * Draws the cube after the moves as an unfolded net.
     *
     * @param colors six colours as "RRGGBB" or "#RRGGBB", in the order U, L, F, R, B, D
     */
    public static String drawSvg(String alg, String[] colors) {
        List<Sticker> stickers = solved();
        for (String move : tokenize(alg)) applyMove(stickers, move);

        final int size = 18, gap = 2, cellSize = size + gap, faceSize = cellSize * 3, margin = 4;
        // Where each face goes in the net, in faces: column, row.
        int[][] origin = {{1, 0}, {0, 1}, {1, 1}, {2, 1}, {3, 1}, {1, 2}};
        int width = faceSize * 4 + margin * 2 + 6;
        int height = faceSize * 3 + margin * 2 + 4;

        StringBuilder svg = new StringBuilder();
        svg.append(String.format(Locale.US,
                "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"%d\" height=\"%d\" viewBox=\"0 0 %d %d\">",
                width, height, width, height));
        for (int face = 0; face < 6; face++) {
            int fx = margin + origin[face][0] * (faceSize + 2);
            int fy = margin + origin[face][1] * (faceSize + 2);
            svg.append(String.format(Locale.US,
                    "<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" rx=\"3\" fill=\"#222222\"/>",
                    fx - 1, fy - 1, faceSize + 1, faceSize + 1));
        }
        for (Sticker s : stickers) {
            int face = faceOf(s.normal);
            int[] rc = cell(face, s.pos);
            int x = margin + origin[face][0] * (faceSize + 2) + rc[1] * cellSize + gap / 2;
            int y = margin + origin[face][1] * (faceSize + 2) + rc[0] * cellSize + gap / 2;
            String color = colors[s.color];
            if (!color.startsWith("#")) color = "#" + color;
            svg.append(String.format(Locale.US,
                    "<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" rx=\"2\" fill=\"%s\"/>",
                    x, y, size, size, color));
        }
        svg.append("</svg>");
        return svg.toString();
    }

    /** Facelet colours (as indexes 0..5 in U, L, F, R, B, D order) for testing: 54 values, face by face. */
    static String debugState(String alg) {
        List<Sticker> stickers = solved();
        for (String move : tokenize(alg)) applyMove(stickers, move);
        int[][] grid = new int[6][9];
        for (Sticker s : stickers) {
            int face = faceOf(s.normal);
            int[] rc = cell(face, s.pos);
            grid[face][rc[0] * 3 + rc[1]] = s.color;
        }
        StringBuilder sb = new StringBuilder();
        for (int f = 0; f < 6; f++) for (int i = 0; i < 9; i++) sb.append("ULFRBD".charAt(grid[f][i]));
        return sb.toString();
    }
}
