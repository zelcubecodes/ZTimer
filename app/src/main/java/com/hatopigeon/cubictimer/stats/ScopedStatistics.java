package com.hatopigeon.cubictimer.stats;

import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.loader.app.LoaderManager;
import androidx.loader.content.Loader;

import com.hatopigeon.cubictimer.puzzle.TrainerScrambler;
import com.hatopigeon.cubictimer.utils.Wrapper;

/**
 * Statistics for one trainer set (OLL, PLL, ...), loaded by the screen that needs them.
 *
 * The normal {@link StatisticsCache} describes the Timer tab's puzzle and category. Trainer solves
 * are kept apart from it: the Trainer tab and the times and graph pages, when they show a trainer
 * set, load their own numbers here, so the two never get mixed up and nothing has to be reloaded
 * when you switch tabs.
 */
public final class ScopedStatistics {

    /** Loader id, unique inside the fragment that uses it (each fragment has its own loader manager). */
    private static final int LOADER_ID = 7001;

    private ScopedStatistics() {
    }

    /** True if the puzzle name is really a trainer set such as "OLL". */
    public static boolean isScoped(String puzzle) {
        if (puzzle == null) return false;
        for (TrainerScrambler.TrainerSubset s : TrainerScrambler.TrainerSubset.values()) {
            if (s.name().equals(puzzle)) return true;
        }
        return false;
    }

    /** Starts loading, and keeps reloading when solves change. Results go to the observer. */
    @SuppressWarnings("deprecation")
    public static void start(@NonNull Fragment fragment, @NonNull final String puzzle,
                             @NonNull final String category,
                             @NonNull final StatisticsCache.StatisticsObserver observer) {
        final Context context = fragment.getContext();
        if (context == null) return;
        fragment.getLoaderManager().restartLoader(LOADER_ID, null,
                new LoaderManager.LoaderCallbacks<Wrapper<Statistics>>() {
                    @NonNull
                    @Override
                    public Loader<Wrapper<Statistics>> onCreateLoader(int id, Bundle args) {
                        return new StatisticsLoader(context, Statistics.newAllTimeStatistics(puzzle),
                                puzzle, category);
                    }

                    @Override
                    public void onLoadFinished(@NonNull Loader<Wrapper<Statistics>> loader,
                                               Wrapper<Statistics> data) {
                        if (data != null) observer.onStatisticsUpdated(data.content());
                    }

                    @Override
                    public void onLoaderReset(@NonNull Loader<Wrapper<Statistics>> loader) {
                    }
                });
    }

    /** Stops loading. Safe to call even if {@link #start} was never called. */
    @SuppressWarnings("deprecation")
    public static void stop(@NonNull Fragment fragment) {
        try {
            fragment.getLoaderManager().destroyLoader(LOADER_ID);
        } catch (Exception ignored) {
        }
    }
}
