package com.hatopigeon.cubictimer.fragment.dialog;

import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.ColorDrawable;
import android.media.Image;
import android.os.Bundle;
import android.util.Pair;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageView;
import android.widget.TextView;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.items.Theme;
import com.hatopigeon.cubictimer.listener.DialogListenerMessage;
import com.hatopigeon.cubictimer.utils.Prefs;
import com.hatopigeon.cubictimer.utils.CsPuzzles;
import com.hatopigeon.cubictimer.utils.PuzzleUtils;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.DialogFragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

public class PuzzleSelectDialog extends DialogFragment {

    private DialogListenerMessage dialogListener;
    private Unbinder mUnbinder;
    private Context mContext;

    @BindView(R.id.list) RecyclerView puzzleRecycler;
    @BindView(R.id.puzzle_tabs) com.google.android.material.tabs.TabLayout tabs;

    /** The tab that was open last time (0 = WCA, 1 = Non-WCA). */
    private static int lastTab = 0;

    private java.util.List<Item> wcaItems;
    private java.util.List<Item> otherItems;
    private PuzzleSelectAdapter puzzleAdapter;

    /** One puzzle in the popup: a name, an icon (a resource or a drawable) and the puzzle type. */
    static class Item {
        final String title;
        final int iconRes;
        final android.graphics.drawable.Drawable icon;
        final String type;

        Item(String title, int iconRes, String type) {
            this.title = title; this.iconRes = iconRes; this.icon = null; this.type = type;
        }

        Item(String title, android.graphics.drawable.Drawable icon, String type) {
            this.title = title; this.iconRes = 0; this.icon = icon; this.type = type;
        }
    }

    public static PuzzleSelectDialog newInstance() {
        return new PuzzleSelectDialog();
    }

    private static final String ARG_TRAINER = "trainer_sets";
    private static final String ARG_TRAINER_CURRENT = "trainer_current";

    /**
     * The same popup, but listing the trainer sets (OLL, PLL, ...) instead of puzzles, one tab per
     * family. Picking one answers with {@code CategorySelectDialog.TRAINER_PREFIX + set + ":*"}.
     *
     * @param currentSet name of the set that is open now (its family tab starts selected), or null
     */
    public static PuzzleSelectDialog newTrainerInstance(String currentSet) {
        PuzzleSelectDialog dialog = new PuzzleSelectDialog();
        Bundle args = new Bundle();
        args.putBoolean(ARG_TRAINER, true);
        args.putString(ARG_TRAINER_CURRENT, currentSet);
        dialog.setArguments(args);
        return dialog;
    }

    /** Fills the popup with the trainer sets, grouped into one tab per family. */
    private void setupTrainerSets(View dialogView, String currentName) {
        ((TextView) dialogView.findViewById(R.id.title)).setText(R.string.dialog_select_trainer);

        final String[] fills = {"#BBDEFB", "#E1BEE7", "#FFE0B2", "#C8E6C9", "#F8BBD0"};
        final String[] texts = {"#1E66E0", "#7B1FA2", "#E65100", "#2E7D32", "#C2185B"};

        final java.util.List<java.util.List<Item>> families = new java.util.ArrayList<>();
        int startFamily = 0;
        for (int f = 0; f < com.hatopigeon.cubictimer.puzzle.TrainerSets.FAMILIES.length; f++) {
            java.util.List<Item> items = new java.util.ArrayList<>();
            for (com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset t
                    : com.hatopigeon.cubictimer.puzzle.TrainerSets.setsInFamily(f)) {
                if (t.name().equals(currentName)) startFamily = f;
                String label = t == com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset.TWOGLL
                        ? "2GLL" : t.name();
                String title = com.hatopigeon.cubictimer.puzzle.TrainerSets.displayName(t);
                if (title.length() > 12) title = label;
                items.add(new Item(title,
                        new LabelIconDrawable(label, Color.parseColor(fills[f % fills.length]),
                                Color.parseColor(texts[f % texts.length])),
                        CategorySelectDialog.TRAINER_PREFIX + t.name() + ":"
                                + com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL));
            }
            families.add(items);
        }

        puzzleRecycler.getLayoutParams().height = (int) (mContext.getResources().getDisplayMetrics().heightPixels * 0.55f);
        puzzleAdapter = new PuzzleSelectAdapter(dialogListener, families.get(startFamily));
        puzzleRecycler.setAdapter(puzzleAdapter);

        tabs.setTabMode(com.google.android.material.tabs.TabLayout.MODE_SCROLLABLE);
        for (int f = 0; f < families.size(); f++) {
            tabs.addTab(tabs.newTab().setText(com.hatopigeon.cubictimer.puzzle.TrainerSets.FAMILIES[f]), f == startFamily);
        }
        tabs.addOnTabSelectedListener(new com.google.android.material.tabs.TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(com.google.android.material.tabs.TabLayout.Tab tab) {
                puzzleAdapter.setItems(families.get(tab.getPosition()));
                puzzleRecycler.scrollToPosition(0);
            }

            @Override public void onTabUnselected(com.google.android.material.tabs.TabLayout.Tab tab) { }
            @Override public void onTabReselected(com.google.android.material.tabs.TabLayout.Tab tab) { }
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        // Make the popup wide enough for three icons per row and the two tab names
        if (getDialog() != null && getDialog().getWindow() != null) {
            int width = (int) (getResources().getDisplayMetrics().widthPixels * 0.92f);
            getDialog().getWindow().setLayout(width, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View dialogView = inflater.inflate(R.layout.dialog_puzzle_select, container);
        mUnbinder = ButterKnife.bind(this, dialogView);

        mContext = getContext();

        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        getDialog().getWindow().requestFeature(Window.FEATURE_NO_TITLE);

        puzzleRecycler.setHasFixedSize(true);

        GridLayoutManager layoutManager = new GridLayoutManager(mContext, 3, RecyclerView.VERTICAL, false);
        puzzleRecycler.setLayoutManager(layoutManager);

        // In trainer mode the popup lists the trainer sets instead of puzzles
        if (getArguments() != null && getArguments().getBoolean(ARG_TRAINER, false)) {
            setupTrainerSets(dialogView, getArguments().getString(ARG_TRAINER_CURRENT));
            return dialogView;
        }

        // Two tabs: the WCA events, and every other puzzle
        wcaItems = new java.util.ArrayList<>();
        wcaItems.add(new Item(getString(R.string.cube_222), R.drawable.ic_2x2, PuzzleUtils.TYPE_222));
        wcaItems.add(new Item(getString(R.string.cube_333), R.drawable.ic_3x3, PuzzleUtils.TYPE_333));
        wcaItems.add(new Item(getString(R.string.cube_444), R.drawable.ic_4x4, PuzzleUtils.TYPE_444));
        wcaItems.add(new Item(getString(R.string.cube_555), R.drawable.ic_5x5, PuzzleUtils.TYPE_555));
        wcaItems.add(new Item(getString(R.string.cube_666), R.drawable.ic_6x6, PuzzleUtils.TYPE_666));
        wcaItems.add(new Item(getString(R.string.cube_777), R.drawable.ic_7x7, PuzzleUtils.TYPE_777));
        wcaItems.add(new Item(getString(R.string.cube_skewb), R.drawable.ic_skewb, PuzzleUtils.TYPE_SKEWB));
        wcaItems.add(new Item(getString(R.string.cube_mega), R.drawable.ic_mega, PuzzleUtils.TYPE_MEGA));
        wcaItems.add(new Item(getString(R.string.cube_pyra), R.drawable.ic_pyra, PuzzleUtils.TYPE_PYRA));
        wcaItems.add(new Item(getString(R.string.cube_sq1), R.drawable.ic_sq1, PuzzleUtils.TYPE_SQUARE1));
        wcaItems.add(new Item(getString(R.string.cube_clock), R.drawable.ic_clock, PuzzleUtils.TYPE_CLOCK));
        wcaItems.add(new Item(getString(R.string.cube_333oh), R.drawable.ic_3x3_oh, PuzzleUtils.TYPE_333OH));
        wcaItems.add(new Item(getString(R.string.cube_333bld), R.drawable.ic_3x3_bld, PuzzleUtils.TYPE_333BLD));
        wcaItems.add(new Item(getString(R.string.cube_444bld), R.drawable.ic_4x4_bld, PuzzleUtils.TYPE_444BLD));
        wcaItems.add(new Item(getString(R.string.cube_555bld), R.drawable.ic_5x5_bld, PuzzleUtils.TYPE_555BLD));
        wcaItems.add(new Item(getString(R.string.cube_333mbld), R.drawable.ic_3x3_mbld, PuzzleUtils.TYPE_333MBLD));
        wcaItems.add(new Item(getString(R.string.cube_333fmc), R.drawable.ic_3x3_fmc, PuzzleUtils.TYPE_333FMC));
        wcaItems.add(new Item(getString(R.string.cube_fto), R.drawable.ic_fto, PuzzleUtils.TYPE_FTO));

        otherItems = new java.util.ArrayList<>();
        otherItems.add(new Item(getString(R.string.cube_bfto), R.drawable.ic_bfto, PuzzleUtils.TYPE_BFTO));
        for (CsPuzzles.Entry e : CsPuzzles.all()) {
            int iconRes = e.icon == null ? 0
                    : getResources().getIdentifier(e.icon, "drawable", mContext.getPackageName());
            if (iconRes != 0) otherItems.add(new Item(e.name, iconRes, e.type));
            else otherItems.add(new Item(e.name, new LabelIconDrawable(e.label, e.fillColor, e.textColor), e.type));
        }
        otherItems.add(new Item(getString(R.string.cube_other), R.drawable.ic_other, PuzzleUtils.TYPE_OTHER));

        // A fixed height, so the popup does not jump in size between the tabs
        puzzleRecycler.getLayoutParams().height = (int) (mContext.getResources().getDisplayMetrics().heightPixels * 0.55f);

        puzzleAdapter = new PuzzleSelectAdapter(dialogListener, lastTab == 0 ? wcaItems : otherItems);
        puzzleRecycler.setAdapter(puzzleAdapter);
        puzzleRecycler.scrollToPosition(0);

        tabs.addTab(tabs.newTab().setText(R.string.puzzle_tab_wca), lastTab == 0);
        tabs.addTab(tabs.newTab().setText(R.string.puzzle_tab_non_wca), lastTab == 1);
        tabs.addOnTabSelectedListener(new com.google.android.material.tabs.TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(com.google.android.material.tabs.TabLayout.Tab tab) {
                lastTab = tab.getPosition();
                puzzleAdapter.setItems(lastTab == 0 ? wcaItems : otherItems);
                puzzleRecycler.scrollToPosition(0);
            }

            @Override public void onTabUnselected(com.google.android.material.tabs.TabLayout.Tab tab) { }
            @Override public void onTabReselected(com.google.android.material.tabs.TabLayout.Tab tab) { }
        });

        return dialogView;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    public void setDialogListener(DialogListenerMessage listener) {
        this.dialogListener = listener;
    }
}

class PuzzleSelectAdapter extends RecyclerView.Adapter<PuzzleSelectAdapter.CardViewHolder> {

    DialogListenerMessage dialogListener;
    java.util.List<PuzzleSelectDialog.Item> puzzles;

    static class CardViewHolder extends RecyclerView.ViewHolder {
        View view;
        TextView title;
        ImageView icon;

        public CardViewHolder(View view) {
            super(view);
            this.view = view;
            this.title = view.findViewById(R.id.title);
            this.icon = view.findViewById(R.id.icon);
        }
    }

    public PuzzleSelectAdapter(DialogListenerMessage dialogListener, java.util.List<PuzzleSelectDialog.Item> puzzles) {
        this.dialogListener = dialogListener;
        this.puzzles = puzzles;
    }

    void setItems(java.util.List<PuzzleSelectDialog.Item> items) {
        this.puzzles = items;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CardViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_puzzle_select, parent, false);
        return new CardViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CardViewHolder holder, int position) {
        final PuzzleSelectDialog.Item item = puzzles.get(position);
        holder.title.setText(item.title);
        if (item.icon != null) holder.icon.setImageDrawable(item.icon);
        else holder.icon.setImageResource(item.iconRes);

        holder.view.setOnClickListener(v -> {
            if (dialogListener != null)
                dialogListener.onUpdateDialog(item.type);
        });
    }

    @Override
    public int getItemCount() {
        return puzzles.size();
    }
}
