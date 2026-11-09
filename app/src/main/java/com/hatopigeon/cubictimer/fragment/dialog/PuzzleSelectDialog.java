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
    @BindView(R.id.trainer_tabs_scroll) android.widget.HorizontalScrollView trainerTabsScroll;
    @BindView(R.id.trainer_tabs_columns) android.widget.LinearLayout trainerTabsContainer;
    @BindView(R.id.trainer_tab_indicator) View trainerTabIndicator;

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
        boolean starred;

        Item(String title, int iconRes, String type) {
            this.title = title; this.iconRes = iconRes; this.icon = null; this.type = type;
        }

        Item(String title, android.graphics.drawable.Drawable icon, String type) {
            this.title = title; this.iconRes = 0; this.icon = icon; this.type = type;
        }

        Item starred(boolean value) {
            this.starred = value;
            return this;
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

    private static final String PREF_STARRED = "trainer_starred_sets";

    private java.util.List<String> trainerTabNames;
    private java.util.List<java.util.List<Item>> trainerTabItems;
    private int selectedTrainerTab = 0;

    private java.util.Set<String> readStarred() {
        return new java.util.HashSet<>(android.preference.PreferenceManager
                .getDefaultSharedPreferences(mContext)
                .getStringSet(PREF_STARRED, new java.util.HashSet<String>()));
    }

    /** One tile for a trainer set. Starred sets get a star in front of their name. */
    private Item trainerItem(com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset t, int family, boolean starred) {
        final String[] fills = {"#BBDEFB", "#E1BEE7", "#FFE0B2", "#C8E6C9", "#F8BBD0"};
        final String[] texts = {"#1E66E0", "#7B1FA2", "#E65100", "#2E7D32", "#C2185B"};
        String label = com.hatopigeon.cubictimer.puzzle.TrainerSets.shortLabel(t);
        String title = com.hatopigeon.cubictimer.puzzle.TrainerSets.displayName(t);
        if (title.length() > 12) title = label;
        return new Item(title,
                new LabelIconDrawable(label, Color.parseColor(fills[family % fills.length]),
                        Color.parseColor(texts[family % texts.length])),
                CategorySelectDialog.TRAINER_PREFIX + t.name() + ":"
                        + com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL).starred(starred);
    }

    /** Builds the tabs: a Starred tab (only when something is starred), then one per family. */
    private void buildTrainerTabs(String selectTabName) {
        final java.util.Set<String> starred = readStarred();
        trainerTabNames.clear();
        trainerTabItems.clear();

        java.util.List<Item> starredItems = new java.util.ArrayList<>();
        for (int f = 0; f < com.hatopigeon.cubictimer.puzzle.TrainerSets.FAMILIES.length; f++) {
            for (com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset t
                    : com.hatopigeon.cubictimer.puzzle.TrainerSets.setsInFamily(f)) {
                if (starred.contains(t.name())) starredItems.add(trainerItem(t, f, true));
            }
        }
        if (!starredItems.isEmpty()) {
            trainerTabNames.add(getString(R.string.trainer_starred_header));
            trainerTabItems.add(starredItems);
        }
        for (int f = 0; f < com.hatopigeon.cubictimer.puzzle.TrainerSets.FAMILIES.length; f++) {
            java.util.List<Item> items = new java.util.ArrayList<>();
            for (com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset t
                    : com.hatopigeon.cubictimer.puzzle.TrainerSets.setsInFamily(f)) {
                items.add(trainerItem(t, f, starred.contains(t.name())));
            }
            trainerTabNames.add(com.hatopigeon.cubictimer.puzzle.TrainerSets.FAMILIES[f]);
            trainerTabItems.add(items);
        }

        int selected = Math.max(0, trainerTabNames.indexOf(selectTabName));
        selectedTrainerTab = selected;
        drawTrainerTabs();
        puzzleAdapter.setItems(trainerTabItems.get(selected));
        puzzleRecycler.scrollToPosition(0);
    }

    /** Swaps the tiles with a quick cross-fade, so changing tab never just snaps. */
    private void showItems(final java.util.List<Item> items) {
        puzzleRecycler.animate().cancel();
        puzzleRecycler.animate().alpha(0f).setDuration(70).withEndAction(() -> {
            if (puzzleAdapter == null) return;
            puzzleAdapter.setItems(items);
            puzzleRecycler.scrollToPosition(0);
            puzzleRecycler.animate().alpha(1f).setDuration(140).start();
        }).start();
    }

    /** Fills the popup with the trainer sets: one tab per family, long press a set to star it. */
    private void setupTrainerSets(View dialogView, String currentName) {
        ((TextView) dialogView.findViewById(R.id.title)).setText(R.string.dialog_select_trainer);

        trainerTabNames = new java.util.ArrayList<>();
        trainerTabItems = new java.util.ArrayList<>();

        String startTab = com.hatopigeon.cubictimer.puzzle.TrainerSets.FAMILIES[0];
        for (com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset t
                : com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset.values()) {
            if (t.name().equals(currentName)) {
                startTab = com.hatopigeon.cubictimer.puzzle.TrainerSets.familyOf(t);
            }
        }

        puzzleRecycler.getLayoutParams().height = trainerPopupHeight();
        puzzleAdapter = new PuzzleSelectAdapter(dialogListener, new java.util.ArrayList<Item>());
        puzzleRecycler.setAdapter(puzzleAdapter);

        tabs.setVisibility(View.GONE);
        trainerTabsScroll.setVisibility(View.VISIBLE);

        puzzleAdapter.setLongClickListener(item -> {
            String name = item.type.substring(CategorySelectDialog.TRAINER_PREFIX.length());
            name = name.substring(0, name.indexOf(':'));
            java.util.Set<String> starred = readStarred();
            boolean nowStarred = !starred.remove(name);
            if (nowStarred) starred.add(name);
            android.preference.PreferenceManager.getDefaultSharedPreferences(mContext)
                    .edit().putStringSet(PREF_STARRED, starred).apply();
            android.widget.Toast.makeText(mContext,
                    getString(nowStarred ? R.string.trainer_starred_toast : R.string.trainer_unstarred_toast, name),
                    android.widget.Toast.LENGTH_SHORT).show();
            int sel = selectedTrainerTab;
            final int keepScroll = trainerTabsScroll.getScrollX();
            puzzleAdapter.popType = item.type; // the tile that changed gives a little pop
            buildTrainerTabs(sel >= 0 && sel < trainerTabNames.size() ? trainerTabNames.get(sel) : null);
            trainerTabsScroll.post(() -> trainerTabsScroll.scrollTo(keepScroll, 0));
            return true;
        });

        buildTrainerTabs(startTab);
    }

    private View[] trainerTabViews = new View[0];
    private android.animation.ValueAnimator indicatorAnim;

    /**
     * Draws the trainer tabs as two rows that scroll sideways together. Each column holds two
     * tabs, and one underline slides to whichever tab is selected.
     */
    private void drawTrainerTabs() {
        final float density = getResources().getDisplayMetrics().density;
        final int selectedColor = ContextCompat.getColor(mContext, R.color.md_blue_A700);
        final int normalColor = ContextCompat.getColor(mContext, R.color.md_light_primary_text);
        trainerTabsContainer.removeAllViews();
        final int n = trainerTabNames.size();
        final TextView[] views = new TextView[n];
        trainerTabViews = views;
        for (int col = 0; col * 2 < n; col++) {
            android.widget.LinearLayout column = new android.widget.LinearLayout(mContext);
            column.setOrientation(android.widget.LinearLayout.VERTICAL);
            for (int row = 0; row < 2; row++) {
                final int index = col * 2 + row;
                if (index >= n) break;
                TextView tab = new TextView(mContext);
                tab.setText(trainerTabNames.get(index).toUpperCase());
                tab.setTextSize(14);
                tab.setGravity(android.view.Gravity.CENTER);
                tab.setSingleLine(true);
                tab.setMinHeight((int) (40 * density));
                tab.setPadding((int) (16 * density), 0, (int) (16 * density), 0);
                tab.setBackgroundResource(R.drawable.bg_popup_item);
                tab.setOnClickListener(v -> {
                    if (index == selectedTrainerTab) return;
                    selectTrainerTab(index);
                });
                views[index] = tab;
                column.addView(tab, new android.widget.LinearLayout.LayoutParams(
                        android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                        android.view.ViewGroup.LayoutParams.WRAP_CONTENT));
            }
            trainerTabsContainer.addView(column, new android.widget.LinearLayout.LayoutParams(
                    android.view.ViewGroup.LayoutParams.WRAP_CONTENT,
                    android.view.ViewGroup.LayoutParams.WRAP_CONTENT));
        }
        for (int i = 0; i < n; i++) views[i].setTextColor(i == selectedTrainerTab ? selectedColor : normalColor);
        // Put the underline under the selected tab once everything has a size, then bring that
        // tab into view
        trainerTabsContainer.post(() -> {
            moveIndicator(false);
            final int selCol = selectedTrainerTab / 2;
            if (selCol < trainerTabsContainer.getChildCount()) {
                View col = trainerTabsContainer.getChildAt(selCol);
                trainerTabsScroll.scrollTo(Math.max(0, col.getLeft() - (int) (24 * density)), 0);
            }
        });
    }

    private void selectTrainerTab(int index) {
        final int selectedColor = ContextCompat.getColor(mContext, R.color.md_blue_A700);
        final int normalColor = ContextCompat.getColor(mContext, R.color.md_light_primary_text);
        int previous = selectedTrainerTab;
        selectedTrainerTab = index;
        // The two labels cross-fade between the normal and the selected colour
        fadeTextColor((TextView) trainerTabViews[previous], selectedColor, normalColor);
        fadeTextColor((TextView) trainerTabViews[index], normalColor, selectedColor);
        moveIndicator(true);
        showItems(trainerTabItems.get(index));
    }

    private void fadeTextColor(final TextView view, int from, int to) {
        android.animation.ValueAnimator a = android.animation.ValueAnimator.ofObject(new android.animation.ArgbEvaluator(), from, to);
        a.setDuration(160);
        a.addUpdateListener(an -> view.setTextColor((Integer) an.getAnimatedValue()));
        a.start();
    }

    /** Slides and resizes the underline so it sits under the selected tab's text. */
    private void moveIndicator(boolean animate) {
        if (trainerTabViews.length == 0 || selectedTrainerTab >= trainerTabViews.length) return;
        final TextView tab = (TextView) trainerTabViews[selectedTrainerTab];
        View column = (View) tab.getParent();
        if (tab.getWidth() == 0) return;
        float density = getResources().getDisplayMetrics().density;
        // The line is as wide as the text, centred, so it looks the same on a long and a short name
        float textWidth = tab.getPaint().measureText(tab.getText().toString());
        final int width = Math.round(textWidth);
        final float targetX = column.getLeft() + tab.getLeft() + (tab.getWidth() - width) / 2f;
        final float targetY = column.getTop() + tab.getBottom() - trainerTabIndicator.getHeight();
        final android.view.ViewGroup.LayoutParams lp = trainerTabIndicator.getLayoutParams();
        if (indicatorAnim != null) indicatorAnim.cancel();
        if (!animate || lp.width == 0) {
            lp.width = width;
            trainerTabIndicator.setLayoutParams(lp);
            trainerTabIndicator.setTranslationX(targetX);
            trainerTabIndicator.setTranslationY(targetY);
            return;
        }
        final int fromW = lp.width;
        final float fromX = trainerTabIndicator.getTranslationX();
        final float fromY = trainerTabIndicator.getTranslationY();
        indicatorAnim = android.animation.ValueAnimator.ofFloat(0f, 1f);
        indicatorAnim.setDuration(220);
        indicatorAnim.setInterpolator(new android.view.animation.DecelerateInterpolator(1.6f));
        indicatorAnim.addUpdateListener(an -> {
            float f = (Float) an.getAnimatedValue();
            lp.width = Math.round(fromW + (width - fromW) * f);
            trainerTabIndicator.setLayoutParams(lp);
            trainerTabIndicator.setTranslationX(fromX + (targetX - fromX) * f);
            trainerTabIndicator.setTranslationY(fromY + (targetY - fromY) * f);
        });
        indicatorAnim.start();
        // Keep the newly selected tab fully visible
        int left = Math.round(targetX) - (int) (16 * density);
        int right = Math.round(targetX) + width + (int) (16 * density);
        if (left < trainerTabsScroll.getScrollX()) trainerTabsScroll.smoothScrollTo(Math.max(0, left), 0);
        else if (right > trainerTabsScroll.getScrollX() + trainerTabsScroll.getWidth())
            trainerTabsScroll.smoothScrollTo(right - trainerTabsScroll.getWidth(), 0);
    }

    private int trainerPopupHeight() {
        float density = getResources().getDisplayMetrics().density;
        return (int) Math.min(getResources().getDisplayMetrics().heightPixels * 0.55f, 460 * density);
    }

    @Override
    public void onStart() {
        super.onStart();
        // Make the popup wide enough for three icons per row and the two tab names
        if (getDialog() != null && getDialog().getWindow() != null) {
            // 92% of the screen on a phone, but never wider than 420dp so it stays compact on tablets
            float density = getResources().getDisplayMetrics().density;
            int width = (int) Math.min(getResources().getDisplayMetrics().widthPixels * 0.92f, 420 * density);
            getDialog().getWindow().setLayout(width, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
            getDialog().getWindow().setWindowAnimations(R.style.PopupWindowAnimation);
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
        puzzleRecycler.getLayoutParams().height = trainerPopupHeight();

        puzzleAdapter = new PuzzleSelectAdapter(dialogListener, lastTab == 0 ? wcaItems : otherItems);
        puzzleRecycler.setAdapter(puzzleAdapter);
        puzzleRecycler.scrollToPosition(0);

        tabs.addTab(tabs.newTab().setText(R.string.puzzle_tab_wca), lastTab == 0);
        tabs.addTab(tabs.newTab().setText(R.string.puzzle_tab_non_wca), lastTab == 1);
        tabs.addOnTabSelectedListener(new com.google.android.material.tabs.TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(com.google.android.material.tabs.TabLayout.Tab tab) {
                lastTab = tab.getPosition();
                showItems(lastTab == 0 ? wcaItems : otherItems);
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

    interface ItemLongClickListener { boolean onLongClick(PuzzleSelectDialog.Item item); }

    private ItemLongClickListener longClickListener;

    /** The tile (by type) that was just starred or unstarred and should give feedback once. */
    String popType;

    void setLongClickListener(ItemLongClickListener listener) { this.longClickListener = listener; }

    static class CardViewHolder extends RecyclerView.ViewHolder {
        View view;
        TextView title;
        ImageView icon;
        ImageView star;

        public CardViewHolder(View view) {
            super(view);
            this.view = view;
            this.title = view.findViewById(R.id.title);
            this.icon = view.findViewById(R.id.icon);
            this.star = view.findViewById(R.id.star_badge);
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

        holder.star.setVisibility(item.starred ? View.VISIBLE : View.GONE);
        if (item.type.equals(popType)) {
            popType = null;
            // Feedback for starring: the tile and its star spring up and settle
            View target = item.starred ? holder.star : holder.icon;
            target.setScaleX(0.4f);
            target.setScaleY(0.4f);
            target.animate().scaleX(1f).scaleY(1f).setDuration(320)
                    .setInterpolator(new android.view.animation.OvershootInterpolator(3f)).start();
        }
        // Pressed tiles shrink a touch, and spring back on release
        holder.view.setOnTouchListener((v, ev) -> {
            switch (ev.getActionMasked()) {
                case android.view.MotionEvent.ACTION_DOWN:
                    v.animate().scaleX(0.95f).scaleY(0.95f).setDuration(90).start();
                    break;
                case android.view.MotionEvent.ACTION_UP:
                case android.view.MotionEvent.ACTION_CANCEL:
                    v.animate().scaleX(1f).scaleY(1f).setDuration(140)
                            .setInterpolator(new android.view.animation.OvershootInterpolator(2f)).start();
                    break;
            }
            return false;
        });
        holder.view.setOnClickListener(v -> {
            if (dialogListener != null)
                dialogListener.onUpdateDialog(item.type);
        });
        holder.view.setOnLongClickListener(v -> longClickListener != null && longClickListener.onLongClick(item));
    }

    @Override
    public int getItemCount() {
        return puzzles.size();
    }
}
