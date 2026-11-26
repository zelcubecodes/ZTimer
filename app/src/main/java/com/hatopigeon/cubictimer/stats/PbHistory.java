package com.hatopigeon.cubictimer.stats;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.hatopigeon.cubictimer.stats.AverageCalculatorSuper.DNF;
import static com.hatopigeon.cubictimer.stats.AverageCalculatorSuper.UNKNOWN;

/**
 * Personal best history and time distribution for one kind of result at a time: single, Ao5,
 * Ao12, Ao100 or Ao1000. Works on the solves of the page's puzzle and category, oldest first.
 * Pure Java, so it can run on a background thread.
 */
public final class PbHistory {
    /** The kinds of result the Stats page can show. 1 means single. */
    public static final int[] NS = {1, 5, 12, 100, 1000};

    private PbHistory() {
    }

    /** One personal best: the value, when it was set, and the best before it (UNKNOWN for the first). */
    public static final class Record {
        public final long value;
        public final long date;
        public final long previous;

        Record(long value, long date, long previous) {
            this.value = value;
            this.date = date;
            this.previous = previous;
        }
    }

    /** Label for a kind of result, for example "Single" or "Ao12". */
    public static String label(int n) {
        return n == 1 ? "Single" : "Ao" + n;
    }

    /**
     * The result after each solve: the solve itself for singles, or the rolling average of the last
     * {@code n} solves. A value is UNKNOWN until {@code n} solves exist, and DNF when too many of
     * them are DNF. Trimming works like the app's averages: the best and worst
     * ceil(n * trimPercent / 100) solves are left out.
     */
    public static long[] series(List<Long> times, int n, int trimPercent) {
        final int size = times.size();
        final long[] out = new long[size];
        if (n <= 1) {
            for (int i = 0; i < size; i++) out[i] = times.get(i);
            return out;
        }
        int trim = (int) Math.ceil(n * (trimPercent / 100f));
        if (n - 2 * trim <= 0) trim = (n - 1) / 2;
        final int divisor = n - 2 * trim;

        final long[] win = new long[n]; // the last n solves, kept sorted
        int count = 0;
        for (int i = 0; i < size; i++) {
            if (i >= n) {
                long gone = times.get(i - n);
                int at = Arrays.binarySearch(win, 0, count, gone);
                if (at >= 0) {
                    System.arraycopy(win, at + 1, win, at, count - at - 1);
                    count--;
                }
            }
            long add = times.get(i);
            int pos = Arrays.binarySearch(win, 0, count, add);
            if (pos < 0) pos = -pos - 1;
            System.arraycopy(win, pos, win, pos + 1, count - pos);
            win[pos] = add;
            count++;

            if (i + 1 < n) {
                out[i] = UNKNOWN;
                continue;
            }
            int dnfs = 0;
            for (int j = count - 1; j >= 0 && win[j] == DNF; j--) dnfs++;
            if (dnfs > trim) {
                out[i] = DNF;
            } else {
                long sum = 0;
                for (int j = trim; j < n - trim; j++) sum += win[j];
                out[i] = (sum + divisor / 2) / divisor;
            }
        }
        return out;
    }

    /** Every time the result got better, oldest first. */
    public static List<Record> records(long[] series, List<Long> dates) {
        final List<Record> out = new ArrayList<>();
        long best = Long.MAX_VALUE;
        long prev = UNKNOWN;
        for (int i = 0; i < series.length; i++) {
            long v = series[i];
            if (v == UNKNOWN || v == DNF || v <= 0) continue;
            if (v < best) {
                best = v;
                long d = i < dates.size() ? dates.get(i) : 0L;
                out.add(new Record(v, d, prev));
                prev = v;
            }
        }
        return out;
    }

    /** How many results are known (not UNKNOWN and not DNF). */
    public static int known(long[] series) {
        int k = 0;
        for (long v : series) if (v != UNKNOWN && v != DNF && v > 0) k++;
        return k;
    }

    /** The bars of a histogram: a first value, a width (both in milliseconds) and a count per bar. */
    public static final class Bins {
        public final long start;
        public final long width;
        public final int[] counts;

        Bins(long start, long width, int[] counts) {
            this.start = start;
            this.width = width;
            this.counts = counts;
        }
    }

    /**
     * Groups the known results into at most ten bars of a round width (0.1 s up to 1 minute, or
     * whole moves for FMC). Returns null when there are fewer than three results.
     */
    public static Bins distribution(long[] series, boolean wholeSeconds) {
        long lo = Long.MAX_VALUE, hi = Long.MIN_VALUE;
        int k = 0;
        for (long v : series) {
            if (v == UNKNOWN || v == DNF || v <= 0) continue;
            k++;
            if (v < lo) lo = v;
            if (v > hi) hi = v;
        }
        if (k < 3) return null;
        final long[] steps = {100, 200, 500, 1000, 2000, 5000, 10000, 20000, 30000, 60000, 120000, 300000, 600000};
        long width = 600000;
        for (long s : steps) {
            if (wholeSeconds && s < 1000) continue;
            if ((hi - lo + s) / s <= 10) {
                width = s;
                break;
            }
        }
        final long start = (lo / width) * width;
        int bins = (int) Math.max(1, (hi - start) / width + 1);
        final int[] counts = new int[bins];
        for (long v : series) {
            if (v == UNKNOWN || v == DNF || v <= 0) continue;
            int b = (int) Math.min(bins - 1, (v - start) / width);
            counts[b]++;
        }
        return new Bins(start, width, counts);
    }
}
