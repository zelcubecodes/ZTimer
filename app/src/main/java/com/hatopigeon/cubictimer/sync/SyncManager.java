package com.hatopigeon.cubictimer.sync;

import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.os.Handler;
import android.os.Looper;

import com.hatopigeon.cubictimer.CubicTimer;
import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.database.DatabaseHandler;
import com.hatopigeon.cubictimer.items.Solve;
import com.hatopigeon.cubictimer.utils.PuzzleUtils;
import com.hatopigeon.cubictimer.utils.TTIntent;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_TIMES_MODIFIED;
import static com.hatopigeon.cubictimer.utils.TTIntent.CATEGORY_TIME_DATA_CHANGES;

/**
 * Keeps the solves in step with the ZTimer website through Supabase. The data that travels is this
 * app's own format: puzzle type, category (subtype), time in ms, penalty 0/1/2, date in ms.
 * A solve is recognised everywhere by a uid made from its date, time and scramble, so the same solve
 * is never added twice. Deleted solves travel as tombstones.
 */
public final class SyncManager {
    public interface Callback {
        void done(boolean ok, String message);
    }

    private static final String PREFS = "ztimer_sync";
    private static final String K_CODE = "code", K_NICK = "nick", K_SINCE = "since", K_LAST = "last";
    private static final String STATE_FILE = "sync_state.json";
    private static final int BATCH = 500;
    private static final Handler MAIN = new Handler(Looper.getMainLooper());
    private static volatile boolean busy = false;
    private static volatile boolean rerun = false;

    private SyncManager() {
    }

    // ------------------------------------------------------------------ settings

    private static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static boolean configured(Context c) {
        return !c.getString(R.string.sync_supabase_url).trim().isEmpty()
                && !c.getString(R.string.sync_supabase_key).trim().isEmpty();
    }

    public static String getCode(Context c) { return prefs(c).getString(K_CODE, ""); }
    public static String getNick(Context c) { return prefs(c).getString(K_NICK, ""); }
    public static long getLast(Context c) { return prefs(c).getLong(K_LAST, 0); }

    public static String makeCode() {
        String ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        SecureRandom r = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 20; i++) {
            sb.append(ch.charAt(r.nextInt(ch.length())));
            if (i % 5 == 4 && i < 19) sb.append('-');
        }
        return sb.toString();
    }

    /** Starts using a code (made here or typed in). Forgets what was synced before. */
    public static boolean setCode(Context c, String code) {
        code = code == null ? "" : code.trim().toUpperCase();
        if (code.length() < 16) return false;
        prefs(c).edit().putString(K_CODE, code).remove(K_SINCE).apply();
        stateFile(c).delete();
        return true;
    }

    public static void signOut(Context c) {
        prefs(c).edit().clear().apply();
        stateFile(c).delete();
    }

    private static File stateFile(Context c) {
        return new File(c.getApplicationContext().getFilesDir(), STATE_FILE);
    }

    // ------------------------------------------------------------------ helpers

    private static String fnv(String s) {
        int h = 0x811c9dc5;
        if (s == null) s = "";
        for (int i = 0; i < s.length(); i++) {
            h ^= s.charAt(i);
            h *= 0x01000193;
        }
        return Integer.toHexString(h);
    }

    private static String uidOf(long date, long time, String scramble) {
        return date + "-" + time + "-" + fnv(scramble);
    }

    private static String hashOf(String puzzle, String cat, long time, int pen, long date, String scr, String com) {
        return fnv(puzzle + "\u0001" + cat + "\u0001" + time + "\u0001" + pen + "\u0001" + date + "\u0001" + (scr == null ? "" : scr)
                + "\u0001" + (com == null ? "" : com));
    }

    private static boolean skip(String puzzle) {
        // multi-blind results are points and moves, not times; they stay on the device they came from
        return PuzzleUtils.TYPE_333MBLD.equals(puzzle);
    }

    private static final class Row {
        long id;
        String uid, hash, puzzle, category, scramble, comment;
        long time, date;
        int penalty;
        boolean history;
    }

    private static List<Row> scan() {
        List<Row> out = new ArrayList<>();
        Cursor c = CubicTimer.getDBHandler().getAllSolves();
        try {
            while (c.moveToNext()) {
                Row r = new Row();
                r.id = c.getLong(DatabaseHandler.IDX_ID);
                r.puzzle = c.getString(DatabaseHandler.IDX_TYPE);
                if (skip(r.puzzle)) continue;
                String sub = c.getString(DatabaseHandler.IDX_SUBTYPE);
                r.category = sub == null || sub.isEmpty() ? "Normal" : sub;
                r.time = c.getLong(DatabaseHandler.IDX_TIME);
                r.date = c.getLong(DatabaseHandler.IDX_DATE);
                r.scramble = c.getString(DatabaseHandler.IDX_SCRAMBLE);
                r.penalty = Solve.getPenalty(c.getInt(DatabaseHandler.IDX_PENALTY));
                r.comment = c.getString(DatabaseHandler.IDX_COMMENT);
                r.history = c.getInt(DatabaseHandler.IDX_HISTORY) != 0;
                r.uid = uidOf(r.date, r.time, r.scramble);
                r.hash = hashOf(r.puzzle, r.category, r.time, r.penalty, r.date, r.scramble, r.comment) + (r.history ? "h" : "");
                out.add(r);
            }
        } finally {
            c.close();
        }
        return out;
    }

    private static Map<String, String> loadState(Context c) {
        Map<String, String> m = new HashMap<>();
        File f = stateFile(c);
        if (!f.exists()) return m;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new java.io.FileInputStream(f), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                int t = line.indexOf('\t');
                if (t > 0) m.put(line.substring(0, t), line.substring(t + 1));
            }
        } catch (Exception ignored) {
        }
        return m;
    }

    private static void saveState(Context c, Map<String, String> m) {
        saveStateSafely(c, m);
    }

    /** A failure worth trying again (no connection, timeout, server hiccup). */
    private static final class Transient extends Exception {
        Transient(String m) {
            super(m);
        }
    }

    private static JSONObject rpcOnce(Context c, JSONObject body) throws Exception {
        String base = c.getString(R.string.sync_supabase_url).trim();
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        String key = c.getString(R.string.sync_supabase_key).trim();
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) new URL(base + "/rest/v1/rpc/zt_sync").openConnection();
            con.setConnectTimeout(15000);
            con.setReadTimeout(40000);
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("apikey", key);
            con.setRequestProperty("Authorization", "Bearer " + key);
            con.setDoOutput(true);
            try (OutputStream os = con.getOutputStream()) {
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }
            int code = con.getResponseCode();
            if (code < 200 || code >= 300) {
                // say what the server really said, not only the number
                String msg = "";
                try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getErrorStream(), StandardCharsets.UTF_8))) {
                    StringBuilder eb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null && eb.length() < 2000) eb.append(line);
                    JSONObject j = new JSONObject(eb.toString());
                    msg = j.optString("message", j.optString("error", ""));
                } catch (Exception ignored) {
                    // no readable message
                }
                String text = "Server answered " + code + (msg.isEmpty() ? "" : ": " + (msg.length() > 120 ? msg.substring(0, 120) : msg));
                if (code >= 500 || code == 429 || code == 408) throw new Transient(text);
                throw new Exception(text);
            }
            StringBuilder sb = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) sb.append(line);
            }
            return new JSONObject(sb.toString());
        } catch (java.io.IOException e) {
            throw new Transient(e instanceof java.net.SocketTimeoutException
                    ? "The server took too long to answer." : "No connection to the sync server.");
        } finally {
            if (con != null) con.disconnect();
        }
    }

    /** Like rpcOnce, but a hiccup is tried again twice (after 1.2 s, then 2.4 s) before giving up. */
    private static JSONObject rpc(Context c, JSONObject body) throws Exception {
        for (int tries = 1; ; tries++) {
            try {
                return rpcOnce(c, body);
            } catch (Transient e) {
                if (tries > 2) throw new Exception(e.getMessage());
                Thread.sleep(1200L * tries);
            }
        }
    }

    private static void saveStateSafely(Context c, Map<String, String> m) {
        // written to a temporary file first, so a crash in the middle can never leave a half-written state
        File f = stateFile(c), tmp = new File(f.getPath() + ".tmp");
        try (java.io.Writer w = new java.io.OutputStreamWriter(new java.io.FileOutputStream(tmp), StandardCharsets.UTF_8)) {
            for (Map.Entry<String, String> e : m.entrySet()) w.write(e.getKey() + "\t" + e.getValue() + "\n");
        } catch (Exception e) {
            //noinspection ResultOfMethodCallIgnored
            tmp.delete();
            return;
        }
        if (!tmp.renameTo(f)) {
            //noinspection ResultOfMethodCallIgnored
            f.delete();
            //noinspection ResultOfMethodCallIgnored
            tmp.renameTo(f);
        }
    }

    // ------------------------------------------------------------------ the sync

    /** Runs a full round in the background: send what changed here, get what changed elsewhere. */
    public static void sync(final Context context, final String nickOrNull, final Callback cb) {
        final Context c = context.getApplicationContext();
        if (!configured(c)) {
            post(cb, false, "The sync server is not set up yet. See supabase/README.md.");
            return;
        }
        final String code = getCode(c);
        if (code.isEmpty()) {
            post(cb, false, "Create or enter a sync code first.");
            return;
        }
        if (busy) {
            rerun = true;   // something changed while syncing: go again as soon as this round ends
            post(cb, false, "Already syncing.");
            return;
        }
        busy = true;
        new Thread(() -> {
            try {
                String msg = run(c, code, nickOrNull);
                post(cb, true, msg);
            } catch (Exception e) {
                post(cb, false, e.getMessage() == null ? "Could not sync." : e.getMessage());
            } finally {
                busy = false;
                if (rerun) {
                    rerun = false;
                    scheduleSoon(c, 3000);
                }
            }
        }).start();
    }

    private static String run(Context c, String code, String nick) throws Exception {
        Map<String, String> state = loadState(c);
        List<Row> rows = scan();
        Set<String> present = new HashSet<>();
        Map<String, Row> byUid = new HashMap<>();
        List<Row> push = new ArrayList<>();
        for (Row r : rows) {
            present.add(r.uid);
            byUid.put(r.uid, r);
            if (!r.hash.equals(state.get(r.uid))) push.add(r);
        }
        List<String> gone = new ArrayList<>();
        for (String u : state.keySet()) if (!present.contains(u)) gone.add(u);

        JSONArray items = new JSONArray();
        for (Row r : push) {
            JSONObject o = new JSONObject();
            o.put("uid", r.uid);
            o.put("puzzle", r.puzzle);
            o.put("category", r.category);
            o.put("time", r.time);
            o.put("penalty", r.penalty);
            o.put("date", r.date);
            o.put("scramble", r.scramble == null ? "" : r.scramble);
            o.put("comment", r.comment == null ? "" : r.comment);
            o.put("history", r.history);
            items.put(o);
        }
        for (String u : gone) {
            JSONObject o = new JSONObject();
            o.put("uid", u);
            o.put("deleted", true);
            o.put("puzzle", "other");
            o.put("time", 0);
            o.put("date", 0);
            items.put(o);
        }

        String since = prefs(c).getString(K_SINCE, null);
        String nickToSend = nick;
        String savedNick = null;
        List<JSONObject> pulled = new ArrayList<>();
        int offset = 0;
        while (true) {
            JSONArray batch = new JSONArray();
            for (int k = offset; k < Math.min(items.length(), offset + BATCH); k++) batch.put(items.get(k));
            offset += batch.length();
            JSONObject body = new JSONObject();
            body.put("p_code", code);
            body.put("p_nick", nickToSend == null || nickToSend.isEmpty() ? JSONObject.NULL : nickToSend);
            body.put("p_since", since == null ? JSONObject.NULL : since);
            body.put("p_solves", batch);
            JSONObject r = rpc(c, body);
            if (r.has("error")) {
                String e = r.optString("error");
                if ("nick_taken".equals(e)) throw new Exception("That nickname is already taken.");
                if ("bad_nick".equals(e)) throw new Exception("Nicknames are 3 to 20 letters, numbers or _.");
                if ("too_many".equals(e)) throw new Exception("Too many solves in one go, please try again.");
                if ("server".equals(e)) {
                    String d = r.optString("detail", "");
                    throw new Exception("The server had a problem" + (d.isEmpty() ? "." : ": " + d));
                }
                throw new Exception("The server refused the sync code.");
            }
            nickToSend = null;
            if (!r.isNull("nick")) savedNick = r.optString("nick");
            since = r.optString("server_time", since);
            JSONArray got = r.optJSONArray("solves");
            if (got != null) for (int k = 0; k < got.length(); k++) pulled.add(got.getJSONObject(k));
            // Keep going while there is more to download or more to send
            if (!r.optBoolean("more", false) && offset >= items.length()) break;
        }

        // Our own changes are now on the server
        for (Row r : push) state.put(r.uid, r.hash);
        for (String u : gone) state.remove(u);

        // What other devices changed (all in one database transaction, which is much faster)
        int applied = applyPulled(pulled, byUid, state);
        saveState(c, state);
        prefs(c).edit().putString(K_SINCE, since).putLong(K_LAST, System.currentTimeMillis())
                .putString(K_NICK, savedNick != null ? savedNick : getNick(c)).apply();
        if (applied > 0) {
            // tell the screens, but do not let that tell us to sync again
            suppressUntil = System.currentTimeMillis() + 5000L;
            MAIN.post(() -> TTIntent.broadcast(CATEGORY_TIME_DATA_CHANGES, ACTION_TIMES_MODIFIED));
        }
        return "Sent " + (push.size() + gone.size()) + ", received " + pulled.size() + (applied > 0 ? " (" + applied + " changes applied)" : "") + ".";
    }

    private static int applyPulled(final List<JSONObject> pulled, final Map<String, Row> byUid, final Map<String, String> state) {
        final int[] applied = {0};
        CubicTimer.getDBHandler().runInTransaction(() -> {
            DatabaseHandler db = CubicTimer.getDBHandler();
            for (JSONObject p : pulled) {
                try {
                    String uid = p.getString("uid");
                    String puzzle = p.optString("puzzle", "other");
                    if (skip(puzzle)) continue;
                    Row mine = byUid.get(uid);
                    if (p.optBoolean("deleted", false)) {
                        if (mine != null) {
                            db.deleteSolveByID(mine.id);
                            applied[0]++;
                        }
                        state.remove(uid);
                        continue;
                    }
                    String cat = p.optString("category", "Normal");
                    long time = p.optLong("time"), date = p.optLong("date");
                    int pen = p.optInt("penalty");
                    String scr = p.isNull("scramble") ? "" : p.optString("scramble", "");
                    String com = p.isNull("comment") ? "" : p.optString("comment", "");
                    boolean hist = p.optBoolean("history", false);
                    String hash = hashOf(puzzle, cat, time, pen, date, scr, com) + (hist ? "h" : "");
                    if (mine != null) {
                        if (!mine.hash.equals(hash)) {
                            Solve s = new Solve(time, puzzle, cat, date, scr, pen, com, hist);
                            s.setId(mine.id);
                            db.updateSolve(s);
                            applied[0]++;
                        }
                    } else {
                        db.addSolve(new Solve(time, puzzle, cat, date, scr, pen, com, hist));
                        applied[0]++;
                    }
                    state.put(uid, hash);
                } catch (Exception ignored) {
                    // one bad row from the server must not stop the others
                }
            }
        });
        return applied[0];
    }

    private static void post(final Callback cb, final boolean ok, final String msg) {
        if (cb != null) MAIN.post(() -> cb.done(ok, msg));
    }

    // ------------------------------------------------------------------ automatic sync

    private static final long MIN_GAP_OPEN = 30 * 1000L;      // when the app comes to the front
    private static final long AFTER_SOLVE = 6 * 1000L;        // a few seconds after a solve changes
    private static final long EVERY = 2 * 60 * 1000L;         // while the app stays open
    private static volatile long suppressUntil = 0;
    private static volatile boolean foreground = false;
    private static boolean watching = false;
    private static int failures = 0;
    private static volatile String lastError = "";

    /** The last problem an automatic sync ran into (empty when the last one worked). */
    public static String getLastError() {
        return lastError;
    }

    private static final Runnable PERIODIC = new Runnable() {
        @Override
        public void run() {
            if (!foreground) return;
            Context c = CubicTimer.getAppContext();
            if (c != null) trySync(c);
            MAIN.postDelayed(this, EVERY);
        }
    };

    private static boolean ready(Context c) {
        return configured(c) && !getCode(c).isEmpty();
    }

    /** True when the phone has a working internet connection (or when we cannot tell). */
    private static boolean online(Context c) {
        try {
            android.net.ConnectivityManager cm = (android.net.ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return true;
            android.net.Network n = cm.getActiveNetwork();
            if (n == null) return false;
            android.net.NetworkCapabilities nc = cm.getNetworkCapabilities(n);
            return nc == null || nc.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception e) {
            return true;
        }
    }

    private static boolean netWatching = false;

    /** Syncs again a moment after the internet comes back, so changes made offline are not left waiting. */
    private static synchronized void watchNetwork(final Context c) {
        if (netWatching) return;
        netWatching = true;
        try {
            android.net.ConnectivityManager cm = (android.net.ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return;
            cm.registerDefaultNetworkCallback(new android.net.ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(android.net.Network network) {
                    MAIN.post(() -> scheduleSoon(c, 2500));
                }
            });
        } catch (Exception ignored) {
            // no network watching on this phone, the timers still work
        }
    }

    /** One quiet round in the background. A failure is tried again later, a little later each time. */
    private static void trySync(final Context c) {
        if (!ready(c)) return;
        if (!online(c)) return;   // offline: the network callback brings us back when it returns
        sync(c, null, (ok, msg) -> {
            if (ok) {
                failures = 0;
                lastError = "";
            } else if (!"Already syncing.".equals(msg)) {
                lastError = msg == null ? "" : msg;
                // a wrong sync code will not fix itself, so do not keep asking
                if (msg != null && msg.contains("refused the sync code")) return;
                failures = Math.min(failures + 1, 5);
                scheduleSoon(c, Math.min(5 * 60 * 1000L, 10 * 1000L * (1L << failures)));
            }
        });
    }

    private static final Runnable SOON = () -> {
        Context c = CubicTimer.getAppContext();
        if (c != null) trySync(c);
    };

    /** Syncs once, after {@code delayMs}. Asking again before then just moves the time (so a burst of solves is one sync). */
    public static void scheduleSoon(Context c, long delayMs) {
        if (!ready(c.getApplicationContext())) return;
        MAIN.removeCallbacks(SOON);
        MAIN.postDelayed(SOON, delayMs);
    }

    /**
     * Starts listening for changes to the solves, so they are sent a few seconds later. Call once when the
     * app starts.
     */
    public static synchronized void watch() {
        if (watching) return;
        watching = true;
        Context app = CubicTimer.getAppContext();
        if (app != null) watchNetwork(app.getApplicationContext());
        TTIntent.registerReceiver(new android.content.BroadcastReceiver() {
            @Override
            public void onReceive(Context context, android.content.Intent intent) {
                String a = intent == null ? null : intent.getAction();
                if (a == null || System.currentTimeMillis() < suppressUntil) return;
                if (a.equals(TTIntent.ACTION_TIME_ADDED) || a.equals(TTIntent.ACTION_TIMES_MODIFIED)
                        || a.equals(TTIntent.ACTION_TIMES_MOVED_TO_HISTORY) || a.equals(TTIntent.ACTION_COMMENT_ADDED)) {
                    scheduleSoon(context, AFTER_SOLVE);
                }
            }
        }, CATEGORY_TIME_DATA_CHANGES);
    }

    /** Called when the app comes to the front: syncs quietly if a code is set, then every couple of minutes while it stays open. */
    public static void autoSync(Context c) {
        Context app = c.getApplicationContext();
        foreground = true;
        if (!ready(app)) return;
        if (System.currentTimeMillis() - getLast(app) >= MIN_GAP_OPEN) trySync(app);
        MAIN.removeCallbacks(PERIODIC);
        MAIN.postDelayed(PERIODIC, EVERY);
    }

    /** Called when the app goes to the background: stops the timer, and sends anything waiting. */
    public static void background(Context c) {
        foreground = false;
        MAIN.removeCallbacks(PERIODIC);
        Context app = c.getApplicationContext();
        if (ready(app)) {
            MAIN.removeCallbacks(SOON);
            trySync(app);
        }
    }
}
