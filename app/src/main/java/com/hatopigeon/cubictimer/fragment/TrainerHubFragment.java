package com.hatopigeon.cubictimer.fragment;

import android.annotation.SuppressLint;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.preference.PreferenceManager;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.CubicTimer;
import com.hatopigeon.cubictimer.fragment.dialog.BottomSheetTrainerDialog;
import com.hatopigeon.cubictimer.items.Solve;
import com.hatopigeon.cubictimer.puzzle.TrainerScrambler;
import com.hatopigeon.cubictimer.utils.PuzzleUtils;
import com.hatopigeon.cubictimer.utils.ScrambleGenerator;
import com.hatopigeon.cubictimer.wca.WcaUi;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * The Trainer tab. It is a complete trainer of its own: pick a set (OLL, PLL, ...), see the case,
 * and time yourself. It has its own timer, so it never interferes with the normal timer tab.
 * Solves are saved under the set's name (for example "OLL") so they stay separate from your
 * puzzle solves.
 *
 * More sets (CMLL, COLL, ZBLL, LSE, ...) are added to {@link TrainerScrambler.TrainerSubset} and
 * to {@link #SUBSETS}.
 */
public class TrainerHubFragment extends Fragment {

    private static final TrainerScrambler.TrainerSubset[] SUBSETS = {
            TrainerScrambler.TrainerSubset.OLL,
            TrainerScrambler.TrainerSubset.PLL,
    };

    private static final String PREF_LAST_SUBSET = "ztimer_trainer_last_subset";
    private static final String CATEGORY = "Normal";
    private static final long HOLD_MS = 300;
    private static final int COLOR_READY = 0xFF2E9E4F;
    private static final int COLOR_HOLD = 0xFFD64545;

    /** Set by the navigation drawer to open the tab on a specific set. */
    private static TrainerScrambler.TrainerSubset pendingSubset = null;

    public static void setPendingSubset(TrainerScrambler.TrainerSubset subset) {
        pendingSubset = subset;
    }

    private enum State {IDLE, HOLDING, READY, RUNNING, JUST_STOPPED}

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final ExecutorService worker = Executors.newSingleThreadExecutor();

    private WcaUi ui;
    private TrainerScrambler.TrainerSubset subset = TrainerScrambler.TrainerSubset.OLL;
    private TextView[] subsetPills;
    private TextView caseText;
    private ImageView caseImage;
    private TextView timerText;
    private TextView statsText;
    private TextView undoButton;

    private State state = State.IDLE;
    private int defaultTimerColor;
    private long startTime;
    private String currentScramble = "";
    private long lastSolveId = -1;
    private boolean viewAlive = false;
    private int caseToken = 0;

    private final Runnable readyRunnable = () -> {
        if (state == State.HOLDING) {
            state = State.READY;
            timerText.setTextColor(COLOR_READY);
        }
    };

    private final Runnable tickRunnable = new Runnable() {
        @Override
        public void run() {
            if (state != State.RUNNING || !viewAlive) return;
            timerText.setText(format(SystemClock.elapsedRealtime() - startTime));
            handler.postDelayed(this, 30);
        }
    };

    public static TrainerHubFragment newInstance() {
        return new TrainerHubFragment();
    }

    @Nullable
    @Override
    @SuppressLint("ClickableViewAccessibility")
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        ui = new WcaUi(requireContext());
        viewAlive = true;

        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(requireContext());
        if (pendingSubset != null) {
            subset = pendingSubset;
            pendingSubset = null;
            prefs.edit().putString(PREF_LAST_SUBSET, subset.name()).apply();
        } else {
            try {
                subset = TrainerScrambler.TrainerSubset.valueOf(
                        prefs.getString(PREF_LAST_SUBSET, TrainerScrambler.TrainerSubset.OLL.name()));
            } catch (IllegalArgumentException e) {
                subset = TrainerScrambler.TrainerSubset.OLL;
            }
        }

        LinearLayout page = new LinearLayout(requireContext());
        page.setOrientation(LinearLayout.VERTICAL);
        page.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        page.setPadding(ui.dp(12), ui.dp(80), ui.dp(12), ui.dp(64));

        // Set picker and cases button
        LinearLayout bar = new LinearLayout(requireContext());
        bar.setOrientation(LinearLayout.HORIZONTAL);
        bar.setGravity(Gravity.CENTER);
        subsetPills = new TextView[SUBSETS.length];
        for (int i = 0; i < SUBSETS.length; i++) {
            final TrainerScrambler.TrainerSubset s = SUBSETS[i];
            TextView pill = ui.pill(s.name(), s == subset);
            pill.setOnClickListener(v -> selectSubset(s));
            subsetPills[i] = pill;
            bar.addView(pill, ui.lp(ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT, 0, 0, 8, 0));
        }
        TextView cases = ui.pill(getString(R.string.trainer_hub_cases_button), false);
        cases.setOnClickListener(v -> openCaseSelection());
        bar.addView(cases);
        page.addView(bar, ui.matchWrap(0, 0, 0, 8));

        // Case: alg and picture
        caseText = ui.text("", 16, true, 1f);
        caseText.setGravity(Gravity.CENTER);
        page.addView(caseText, ui.matchWrap(8, 4, 8, 4));

        caseImage = new ImageView(requireContext());
        caseImage.setAdjustViewBounds(true);
        caseImage.setScaleType(ImageView.ScaleType.FIT_CENTER);
        page.addView(caseImage, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ui.dp(150)));

        // Timer area: takes all remaining space, touch anywhere in it
        FrameLayout timerArea = new FrameLayout(requireContext());
        timerText = ui.text("0.00", 64, true, 1f);
        timerText.setGravity(Gravity.CENTER);
        defaultTimerColor = timerText.getCurrentTextColor();
        timerArea.addView(timerText, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.CENTER));
        timerArea.setOnTouchListener((v, e) -> onTimerTouch(e));
        page.addView(timerArea, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));

        // Stats and undo
        statsText = ui.text("", 13, false, 0.8f);
        statsText.setGravity(Gravity.CENTER);
        page.addView(statsText, ui.matchWrap(4, 0, 4, 4));

        undoButton = ui.pill(getString(R.string.trainer_hub_undo), false);
        undoButton.setVisibility(View.INVISIBLE);
        undoButton.setOnClickListener(v -> undoLastSolve());
        LinearLayout.LayoutParams undoLp = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        undoLp.gravity = Gravity.CENTER_HORIZONTAL;
        page.addView(undoButton, undoLp);

        newCase();
        refreshStats();
        return page;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        viewAlive = false;
        handler.removeCallbacksAndMessages(null);
        if (state == State.RUNNING) {
            state = State.IDLE;
            setTiming(false);
        }
        state = State.IDLE;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        worker.shutdownNow();
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        // A running attempt is cancelled if the tab is left (the pager is locked while timing, so
        // this only happens if something else steals focus).
        if (!isVisibleToUser && viewAlive && state == State.RUNNING) {
            state = State.IDLE;
            handler.removeCallbacks(tickRunnable);
            setTiming(false);
            timerText.setText("0.00");
        }
    }

    // ------------------------------------------------------------------ set and cases

    private void selectSubset(TrainerScrambler.TrainerSubset s) {
        if (state == State.RUNNING || s == subset) return;
        subset = s;
        PreferenceManager.getDefaultSharedPreferences(requireContext())
                .edit().putString(PREF_LAST_SUBSET, s.name()).apply();
        for (int i = 0; i < SUBSETS.length; i++) ui.stylePill(subsetPills[i], SUBSETS[i] == subset);
        timerText.setText("0.00");
        undoButton.setVisibility(View.INVISIBLE);
        newCase();
        refreshStats();
    }

    private void openCaseSelection() {
        if (state == State.RUNNING) return;
        BottomSheetTrainerDialog dialog = BottomSheetTrainerDialog.newInstance(subset, CATEGORY);
        // Only refresh this tab. The normal timer must keep its own scramble.
        dialog.setDismissListener(() -> {
            if (viewAlive) newCase();
        });
        dialog.show(getChildFragmentManager(), "trainer_dialog_fragment");
    }

    private boolean hasSelectedCases() {
        return !TrainerScrambler.fetchSelectedItems(subset, CATEGORY).isEmpty();
    }

    /** Picks a new case in the background and shows it. */
    private void newCase() {
        final int token = ++caseToken;
        final TrainerScrambler.TrainerSubset forSubset = subset;
        if (!hasSelectedCases()) {
            currentScramble = "";
            caseText.setText(R.string.trainer_help_message);
            caseImage.setImageDrawable(null);
            return;
        }
        caseText.setText("...");
        try {
            worker.execute(() -> {
                String scramble;
                Drawable image = null;
                try {
                    scramble = TrainerScrambler.generateTrainerCase(
                            CubicTimer.getAppContext(), forSubset, CATEGORY);
                    SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(
                            CubicTimer.getAppContext());
                    image = new ScrambleGenerator(PuzzleUtils.TYPE_333)
                            .generateImageFromScramble(prefs, scramble);
                } catch (Exception e) {
                    scramble = "";
                }
                final String s = scramble;
                final Drawable d = image;
                handler.post(() -> {
                    if (!viewAlive || token != caseToken) return;
                    currentScramble = s;
                    caseText.setText(s);
                    caseImage.setImageDrawable(d);
                });
            });
        } catch (java.util.concurrent.RejectedExecutionException ignored) {
            // The fragment is going away.
        }
    }

    // ------------------------------------------------------------------ timer

    private boolean onTimerTouch(MotionEvent e) {
        switch (e.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                if (state == State.RUNNING) {
                    stopTimer();
                    return true;
                }
                if (state == State.IDLE) {
                    if (currentScramble.isEmpty()) {
                        // No cases chosen yet. Send them to the selection instead of timing.
                        if (!hasSelectedCases()) openCaseSelection();
                        return true;
                    }
                    state = State.HOLDING;
                    timerText.setTextColor(COLOR_HOLD);
                    handler.postDelayed(readyRunnable, HOLD_MS);
                }
                return true;

            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if (state == State.JUST_STOPPED) {
                    state = State.IDLE;
                } else if (state == State.READY && e.getActionMasked() == MotionEvent.ACTION_UP) {
                    startTimer();
                } else if (state == State.HOLDING || state == State.READY) {
                    handler.removeCallbacks(readyRunnable);
                    state = State.IDLE;
                    timerText.setTextColor(defaultTimerColor);
                }
                return true;
        }
        return true;
    }

    private void startTimer() {
        state = State.RUNNING;
        timerText.setTextColor(defaultTimerColor);
        undoButton.setVisibility(View.INVISIBLE);
        startTime = SystemClock.elapsedRealtime();
        setTiming(true);
        handler.post(tickRunnable);
    }

    private void stopTimer() {
        long elapsed = SystemClock.elapsedRealtime() - startTime;
        state = State.JUST_STOPPED;
        handler.removeCallbacks(tickRunnable);
        timerText.setText(format(elapsed));
        setTiming(false);

        final Solve solve = new Solve(elapsed, subset.name(), CATEGORY,
                System.currentTimeMillis(), currentScramble, PuzzleUtils.NO_PENALTY, "", false);
        final String name = subset.name();
        try {
            worker.execute(() -> {
                long id = CubicTimer.getDBHandler().addSolve(solve);
                handler.post(() -> {
                    if (!viewAlive || !name.equals(subset.name())) return;
                    lastSolveId = id;
                    undoButton.setVisibility(View.VISIBLE);
                    refreshStats();
                });
            });
        } catch (java.util.concurrent.RejectedExecutionException ignored) {
        }
        newCase();
    }

    private void undoLastSolve() {
        if (lastSolveId < 0) return;
        final long id = lastSolveId;
        lastSolveId = -1;
        undoButton.setVisibility(View.INVISIBLE);
        try {
            worker.execute(() -> {
                CubicTimer.getDBHandler().deleteSolveByID(id);
                handler.post(() -> {
                    if (viewAlive) refreshStats();
                });
            });
        } catch (java.util.concurrent.RejectedExecutionException ignored) {
        }
    }

    /** Hides the top and bottom bars and locks swiping while the timer runs. */
    private void setTiming(boolean running) {
        Fragment p = getParentFragment();
        if (p instanceof TimerFragmentMain) {
            ((TimerFragmentMain) p).setTimingActive(running);
        }
    }

    // ------------------------------------------------------------------ stats

    private void refreshStats() {
        final String type = subset.name();
        try {
            worker.execute(() -> {
                final List<long[]> solves = new ArrayList<>(); // {time, isDnf}
                Cursor c = CubicTimer.getDBHandler().getAllSolvesFrom(type, CATEGORY);
                try {
                    int timeCol = c.getColumnIndex("time");
                    int penaltyCol = c.getColumnIndex("penalty");
                    int historyCol = c.getColumnIndex("history");
                    while (c.moveToNext()) {
                        if (historyCol >= 0 && c.getInt(historyCol) != 0) continue;
                        boolean dnf = c.getInt(penaltyCol) == PuzzleUtils.PENALTY_DNF;
                        solves.add(new long[]{c.getLong(timeCol), dnf ? 1 : 0});
                    }
                } finally {
                    c.close();
                }
                final String text = buildStats(solves);
                handler.post(() -> {
                    if (viewAlive && type.equals(subset.name())) statsText.setText(text);
                });
            });
        } catch (java.util.concurrent.RejectedExecutionException ignored) {
        }
    }

    private String buildStats(List<long[]> solves) {
        int n = solves.size();
        if (n == 0) return getString(R.string.trainer_hub_no_solves);

        long best = Long.MAX_VALUE;
        for (long[] s : solves) if (s[1] == 0 && s[0] < best) best = s[0];
        String last = solves.get(n - 1)[1] == 1 ? "DNF" : format(solves.get(n - 1)[0]);

        return "Last " + last
                + "   Best " + (best == Long.MAX_VALUE ? "--" : format(best))
                + "   Ao5 " + average(solves, 5)
                + "   Ao12 " + average(solves, 12)
                + "   (" + n + ")";
    }

    /** Average of the last {@code size} solves without the best and worst, or "--" if too few. */
    private String average(List<long[]> solves, int size) {
        int n = solves.size();
        if (n < size) return "--";
        List<long[]> window = solves.subList(n - size, n);
        int dnfs = 0;
        for (long[] s : window) if (s[1] == 1) dnfs++;
        if (dnfs > 1) return "DNF";

        long sum = 0, min = Long.MAX_VALUE, max = Long.MIN_VALUE;
        for (long[] s : window) {
            long t = s[1] == 1 ? Long.MAX_VALUE : s[0];
            if (t < min) min = t;
            if (t > max) max = t;
            if (t != Long.MAX_VALUE) sum += t;
        }
        // Remove the best, and the worst (the DNF if there is one)
        sum -= min;
        if (max != Long.MAX_VALUE) sum -= max;
        return format(sum / (size - 2));
    }

    // ------------------------------------------------------------------ helpers

    /** 12.34 or 1:02.34 */
    private static String format(long ms) {
        long cs = ms / 10;
        long minutes = cs / 6000;
        long seconds = (cs / 100) % 60;
        long hundredths = cs % 100;
        if (minutes > 0) {
            return String.format(java.util.Locale.US, "%d:%02d.%02d", minutes, seconds, hundredths);
        }
        return String.format(java.util.Locale.US, "%d.%02d", seconds, hundredths);
    }
}
