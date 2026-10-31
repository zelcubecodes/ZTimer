package com.hatopigeon.cubictimer.fragment;

import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.puzzle.TrainerScrambler;
import com.hatopigeon.cubictimer.wca.WcaUi;

/**
 * The Trainer tab. Lists the sets that can be trained and starts the trainer for the one you tap.
 * More sets (CMLL, COLL, ZBLL, LSE, ...) are added by appending to {@link #ENTRIES}.
 */
public class TrainerHubFragment extends Fragment {

    private static class Entry {
        final TrainerScrambler.TrainerSubset subset;
        final String title;
        final int cases;

        Entry(TrainerScrambler.TrainerSubset subset, String title, int cases) {
            this.subset = subset;
            this.title = title;
            this.cases = cases;
        }
    }

    private static final Entry[] ENTRIES = {
            new Entry(TrainerScrambler.TrainerSubset.OLL, "OLL", 57),
            new Entry(TrainerScrambler.TrainerSubset.PLL, "PLL", 21),
    };

    public static TrainerHubFragment newInstance() {
        return new TrainerHubFragment();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        WcaUi ui = new WcaUi(requireContext());

        ScrollView scroll = new ScrollView(requireContext());
        scroll.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        scroll.setClipToPadding(false);
        scroll.setVerticalScrollBarEnabled(false);
        scroll.setPadding(ui.dp(12), ui.dp(80), ui.dp(12), ui.dp(64));

        LinearLayout page = new LinearLayout(requireContext());
        page.setOrientation(LinearLayout.VERTICAL);
        scroll.addView(page, new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        final TimerFragmentMain main = getParentFragment() instanceof TimerFragmentMain
                ? (TimerFragmentMain) getParentFragment() : null;
        boolean training = main != null
                && TimerFragment.TIMER_MODE_TRAINER.equals(main.getCurrentTimerMode());
        TrainerScrambler.TrainerSubset active = training ? main.getCurrentTrainerSubset() : null;

        TextView hint = ui.text(getString(R.string.trainer_hub_hint), 13, false, 0.7f);
        page.addView(hint, ui.matchWrap(4, 0, 4, 12));

        for (final Entry e : ENTRIES) {
            boolean isActive = e.subset == active;
            LinearLayout card = ui.card(isActive);

            LinearLayout row = new LinearLayout(requireContext());
            row.setOrientation(LinearLayout.HORIZONTAL);
            row.setGravity(Gravity.CENTER_VERTICAL);

            LinearLayout texts = new LinearLayout(requireContext());
            texts.setOrientation(LinearLayout.VERTICAL);
            texts.addView(ui.text(e.title, 20, true, 1f));
            texts.addView(ui.text(getString(R.string.trainer_hub_cases, e.cases), 13, false, 0.7f));
            row.addView(texts, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

            if (isActive) {
                row.addView(ui.text(getString(R.string.trainer_hub_active), 13, true, 1f));
            }
            card.addView(row);

            card.setOnClickListener(v -> {
                if (main != null) main.startTrainer(e.subset);
            });
            page.addView(card, ui.matchWrap(0, 0, 0, 8));
        }

        if (training) {
            TextView exit = ui.pill(getString(R.string.trainer_hub_exit), false);
            exit.setOnClickListener(v -> main.startTrainer(null));
            page.addView(exit, ui.matchWrap(0, 8, 0, 0));
        }

        return scroll;
    }
}
