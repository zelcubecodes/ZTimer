package com.hatopigeon.cubictimer.utils;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * csTimer's case lists for the practice sets (assets/trainer_cases.json): the name of every case,
 * in csTimer's own order, and a small picture of its last layer. A case's position in the list is
 * the number csTimer's scrambler takes to build that case.
 */
public final class CsCases {

    private CsCases() {
    }

    private static final Map<String, List<String>> NAMES = new HashMap<>();
    private static final Map<String, List<String>> PICTURES = new HashMap<>();
    private static final Map<String, List<Integer>> WEIGHTS = new HashMap<>();
    private static boolean loaded;

    private static synchronized void load(Context context) {
        if (loaded || context == null) return;
        try (InputStream in = context.getApplicationContext().getAssets().open("trainer_cases.json")) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            JSONObject root = new JSONObject(out.toString("UTF-8"));
            java.util.Iterator<String> keys = root.keys();
            while (keys.hasNext()) {
                String type = keys.next();
                JSONObject entry = root.getJSONObject(type);
                JSONArray names = entry.getJSONArray("names");
                JSONArray pics = entry.getJSONArray("pics");
                List<String> nameList = new ArrayList<>();
                List<String> picList = new ArrayList<>();
                for (int i = 0; i < names.length(); i++) {
                    nameList.add(names.getString(i));
                    picList.add(pics.isNull(i) ? null : pics.getString(i));
                }
                // How many positions csTimer counts for each case (its "actual" probability).
                JSONArray probs = entry.optJSONArray("probs");
                List<Integer> weightList = new ArrayList<>();
                for (int i = 0; i < names.length(); i++) {
                    weightList.add(probs == null ? 1 : Math.max(1, probs.optInt(i, 1)));
                }
                NAMES.put(type, nameList);
                PICTURES.put(type, picList);
                WEIGHTS.put(type, weightList);
            }
            loaded = true;
        } catch (Exception e) {
            Log.e("CSCASES", "Could not read trainer_cases.json: " + e);
        }
    }

    /** True once the case lists have been read. */
    public static boolean isAvailable(Context context) {
        load(context);
        return loaded;
    }

    /** All case names of a csTimer type, in csTimer's order (empty if the type has none). */
    public static List<String> names(Context context, String type) {
        load(context);
        List<String> names = NAMES.get(type);
        return names == null ? Collections.<String>emptyList() : names;
    }

    /**
     * csTimer's own weight of a case: how often it comes up when csTimer picks a case by its real
     * probability (a case with more positions is more likely). 1 if the case or type is unknown.
     */
    public static int weight(Context context, String type, String caseName) {
        load(context);
        List<String> names = NAMES.get(type);
        List<Integer> weights = WEIGHTS.get(type);
        if (names == null || weights == null) return 1;
        int index = names.indexOf(caseName);
        return index < 0 || index >= weights.size() ? 1 : weights.get(index);
    }

    /** The weight of a case by its position in csTimer's list for that type. */
    public static int weightAt(Context context, String type, int index) {
        load(context);
        List<Integer> weights = WEIGHTS.get(type);
        return weights == null || index < 0 || index >= weights.size() ? 1 : weights.get(index);
    }

    /** The group a case belongs to: its name without the trailing number ("H-2" is in "H"). */
    public static String groupOf(String caseName) {
        int dash = caseName.lastIndexOf('-');
        return dash > 0 ? caseName.substring(0, dash) : caseName;
    }

    /** The cube picture of a case in the format of {@link com.hatopigeon.cubictimer.layout.Cube}, or null. */
    public static String state(Context context, String type, String caseName) {
        load(context);
        List<String> names = NAMES.get(type);
        if (names == null) return null;
        int index = names.indexOf(caseName);
        if (index < 0) return null;
        String pic = PICTURES.get(type).get(index);
        return pic == null ? null : toCubeState(pic);
    }

    /**
     * Turns csTimer's 21 letter last layer picture (the top face, then the front, right, back and
     * left stickers along its edges) into the 5x5 grid the Cube view draws.
     */
    static String toCubeState(String p) {
        char[] s = new char[25];
        java.util.Arrays.fill(s, 'X');
        // back stickers along the top border, from the left
        s[1] = color(p.charAt(17));
        s[2] = color(p.charAt(16));
        s[3] = color(p.charAt(15));
        for (int row = 1; row <= 3; row++) {
            s[5 * row] = color(p.charAt(18 + row - 1));                 // left stickers
            for (int col = 1; col <= 3; col++) {
                s[5 * row + col] = color(p.charAt(3 * (row - 1) + col - 1)); // top face
            }
            s[5 * row + 4] = color(p.charAt(15 - row));                 // right stickers
        }
        for (int col = 1; col <= 3; col++) {
            s[20 + col] = color(p.charAt(9 + col - 1));                 // front stickers
        }
        return new String(s);
    }

    /** csTimer's letters are faces; the Cube view's letters are colours. */
    private static char color(char c) {
        switch (c) {
            case 'D': return 'Y'; // the colour of the layer being solved
            case 'F': return 'G';
            case 'R': return 'R';
            case 'B': return 'B';
            case 'L': return 'O';
            case 'U': return 'W';
            default:  return 'N'; // not shown
        }
    }
}
