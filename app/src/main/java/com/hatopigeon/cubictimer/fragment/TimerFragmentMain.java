package com.hatopigeon.cubictimer.fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.afollestad.materialdialogs.MaterialDialog;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.signature.ObjectKey;
import com.hatopigeon.cubictimer.fragment.dialog.CategorySelectDialog;
import com.hatopigeon.cubictimer.fragment.dialog.BottomSheetTrainerDialog;
import com.hatopigeon.cubictimer.fragment.dialog.PuzzleSelectDialog;
import com.hatopigeon.cubictimer.listener.DialogListenerMessage;
import com.hatopigeon.cubictimer.puzzle.TrainerSets;
import com.hatopigeon.cubictimer.puzzle.TrainerScrambler;
import com.hatopigeon.cubictimer.utils.InsetsUtils;
import com.hatopigeon.cubictimer.utils.Prefs;
import com.hatopigeon.cubictimer.utils.ThemeUtils;
import com.google.android.material.tabs.TabLayout;

import androidx.appcompat.content.res.AppCompatResources;
import androidx.cardview.widget.CardView;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.loader.app.LoaderManager;
import androidx.loader.content.Loader;
import androidx.viewpager.widget.ViewPager;

import android.text.InputFilter;
import android.text.InputType;
import android.text.TextUtils;
import android.util.Log;
import android.util.TypedValue;
import android.view.ActionMode;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.CubicTimer;
import com.hatopigeon.cubictimer.activity.MainActivity;
import com.hatopigeon.cubictimer.layout.LockedViewPager;
import com.hatopigeon.cubictimer.stats.Statistics;
import com.hatopigeon.cubictimer.stats.StatisticsCache;
import com.hatopigeon.cubictimer.stats.StatisticsLoader;
import com.hatopigeon.cubictimer.utils.PuzzleUtils;
import com.hatopigeon.cubictimer.utils.Wrapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

import static com.hatopigeon.cubictimer.fragment.TimerFragment.TIMER_MODE_TIMER;
import static com.hatopigeon.cubictimer.fragment.TimerFragment.TIMER_MODE_TRAINER;
import static com.hatopigeon.cubictimer.utils.PuzzleUtils.isTimeDisabled;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_BLUETOOTH_CONNECT;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_BLUETOOTH_CONNECTED;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_BLUETOOTH_DISCONNECTED;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_CHANGED_CATEGORY;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_CHANGED_THEME;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_DELETE_SELECTED_TIMES;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_HISTORY_TIMES_SHOWN;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_SCROLLED_PAGE;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_SELECTION_MODE_OFF;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_SELECTION_MODE_ON;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_SESSION_TIMES_SHOWN;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_TIMER_STARTED;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_TIMER_STOPPED;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_TIME_SELECTED;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_TIME_UNSELECTED;
import static com.hatopigeon.cubictimer.utils.TTIntent.ACTION_TOOLBAR_RESTORED;
import static com.hatopigeon.cubictimer.utils.TTIntent.CATEGORY_TIME_DATA_CHANGES;
import static com.hatopigeon.cubictimer.utils.TTIntent.CATEGORY_UI_INTERACTIONS;
import static com.hatopigeon.cubictimer.utils.TTIntent.TTFragmentBroadcastReceiver;
import static com.hatopigeon.cubictimer.utils.TTIntent.broadcast;
import static com.hatopigeon.cubictimer.utils.TTIntent.registerReceiver;
import static com.hatopigeon.cubictimer.utils.TTIntent.unregisterReceiver;

public class TimerFragmentMain extends BaseFragment implements DialogListenerMessage {
    /**
     * Flag to enable debug logging for this class.
     */
    private static final boolean DEBUG_ME = true;

    /**
     * A "tag" to identify this class in log messages.
     */
    private static final String TAG = TimerFragmentMain.class.getSimpleName();

    /**
     * The zero-based position of the timer fragment/tab/page.
     */
    public static final int TIMER_PAGE = 0;

    /**
     * The zero-based position of the timer list fragment/tab/page.
     */
    public static final int LIST_PAGE = 1;

    /**
     * The zero-based position of the timer graph fragment/tab/page.
     */
    public static final int GRAPH_PAGE = 2;

    /** The trainer page (OLL, PLL and other case trainers). */
    public static final int TRAINER_PAGE = 3;

    /** The WCA page. It holds WCA Results and WCA Live behind a switch at the top. */
    public static final int WCA_PAGE = 4;

    /**
     * The total number of pages.
     */
    private static final int NUM_PAGES = 5;

    private static final String PUZZLE         = "puzzle";
    private static final String PUZZLE_SUBTYPE = "puzzle_type";
    private static final String MBLD_NUM       = "mbld_num";
    private static final String SCRAMBLE       = "scramble";
    private static final String TIMER_MODE     = "timer_mode";
    private static final String TRAINER_SUBSET    = "trainer_subset";
    private static final String PAGE = "page";

    private static final String TAG_CATEGORY_DIALOG = "select_category_dialog";
    private static final String TAG_PUZZLE_DIALOG   = "puzzle_spinner_dialog_fragment";

    private Unbinder mUnbinder;

    @BindView(R.id.root)         RelativeLayout  rootLayout;
    @BindView(R.id.toolbar)      CardView        mToolbar;
    @BindView(R.id.pager)        LockedViewPager viewPager;
    @BindView(R.id.main_tabs)    TabLayout       tabLayout;
    @BindView(R.id.main_tab_background) View     tabBackground;
    @BindView(R.id.tab_view)    View            tabView;
    @BindView(R.id.puzzleSpinner)View            puzzleSpinnerLayout;

    @BindView(R.id.nav_button_settings) View      navButtonSettings;
    @BindView(R.id.nav_button_bluetooth) ImageView navButtonBluetooth;
    @BindView(R.id.nav_button_category) View      navButtonCategory;
    @BindView(R.id.nav_button_history) ImageView navButtonHistory;
    @BindView(R.id.nav_button_cases) View        navButtonCases;
    @BindView(R.id.nav_button_stats_mode) ImageView navButtonStatsMode;

    @BindView(R.id.puzzleCategory) TextView puzzleCategoryText;
    @BindView(R.id.puzzleName) TextView puzzleNameText;
    @BindView(R.id.puzzleNumber) TextView puzzleNumber;

    @BindView(R.id.bgImage) ImageView bgImage;
    @BindView(R.id.bgGradientOverlay) View bgGradientOverlay;

    ActionMode actionMode;

    private LinearLayout      tabStrip;
    private NavigationAdapter viewPagerAdapter;

    /** Preference that remembers which trainer set (OLL, PLL, ...) the Trainer tab is on. */
    public static final String PREF_TRAINER_SUBSET = "ztimer_trainer_last_subset";

    /** The Trainer tab keeps its own solves under the set's name, in this category. */
    private static final String TRAINER_CATEGORY = "Normal";

    /** The set the Trainer tab trains. Independent of the Timer tab's puzzle. */
    private TrainerScrambler.TrainerSubset trainerSubset = TrainerScrambler.TrainerSubset.OLL;

    /**
     * When set, the times and graph pages show this trainer set instead of the Timer tab's puzzle.
     * Chosen from the category list on those pages. The Timer tab is not affected.
     */
    private TrainerScrambler.TrainerSubset statsSubset = null;

    /** With {@link #statsSubset}: one group of that set, or {@code DatabaseHandler.SUBTYPE_ALL} for all of it. */
    private String statsGroup = com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL;

    /** Prefix that tells the category dialog's answer apart from a normal category name. */
    public static final String STATS_TRAINER_PREFIX = CategorySelectDialog.TRAINER_PREFIX;

    // Stores the current puzzle being timed/shown
    private String                         currentPuzzle;
    private String                         currentPuzzleCategory;
    private TrainerScrambler.TrainerSubset currentPuzzleSubset;
    private String                         currentTimerMode;
    private int                            currentMbldNum;
    private String                         currentScramble;

    // Stores the current state of the list switch
    boolean history = false;

    int currentPage = TIMER_PAGE;
    private boolean pagerEnabled;
    private boolean smartTimerEnabled;

    private boolean bgImageEnabled;
    private int colorOverlayOpacity;

    private int selectCount = 0;

    private CategorySelectDialog categoryDialog;

    private View.OnClickListener clickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            switch (view.getId()) {
                case R.id.nav_button_category:
                    if (viewPager != null && viewPager.getCurrentItem() == TRAINER_PAGE) {
                        showTrainerCategoryDialog();
                        break;
                    }
                    if (statsSubset != null && onStatsPages()) {
                        // Trainer stats: the category button picks the group of the open set
                        showStatsGroupDialog();
                        break;
                    }
                    categoryDialog = CategorySelectDialog.newInstance(currentPuzzle, currentPuzzleCategory, currentTimerMode, currentPuzzleSubset, false);
                    categoryDialog.setDialogListener(categoryDialogListener);
                    categoryDialog.show(mFragmentManager, TAG_CATEGORY_DIALOG);
                    break;
                case R.id.nav_button_history:
                    history = !history;

                    updateHistorySwitchItem();

                    broadcast(CATEGORY_TIME_DATA_CHANGES,
                              history ? ACTION_HISTORY_TIMES_SHOWN : ACTION_SESSION_TIMES_SHOWN);
                    break;
                case R.id.nav_button_settings:
                    getMainActivity().openDrawer();
                    break;
                case R.id.nav_button_bluetooth:
                    broadcast(CATEGORY_UI_INTERACTIONS, ACTION_BLUETOOTH_CONNECT);
                    break;
                case R.id.puzzleNumber:
                    MaterialDialog dialog = ThemeUtils.roundDialog(mContext, new MaterialDialog.Builder(mContext)
                            .title(R.string.input_number_of_puzzles)
                            .inputType(InputType.TYPE_CLASS_NUMBER)
                            .input(null, String.valueOf(currentMbldNum), false, (dialog1, input) -> {
                                currentMbldNum = Math.max(Integer.parseInt(input.toString()), 2);
                                Prefs.edit().putInt(R.string.pk_last_used_mbld_num, currentMbldNum).apply();

                                mFragmentManager
                                        .beginTransaction()
                                        .replace(R.id.main_activity_container,
                                                TimerFragmentMain.newInstance(currentPuzzle, currentPuzzleCategory, currentMbldNum, "reset", currentTimerMode, currentPuzzleSubset, currentPage), "fragment_main")
                                        .commit();
                            })
                            .positiveText(R.string.action_ok)
                            .negativeText(R.string.action_cancel)
                            .build());
                    EditText editText = dialog.getInputEditText();
                    if (editText != null) {
                        editText.setFilters(new InputFilter[] {new InputFilter.LengthFilter(2)});
                        editText.setGravity(Gravity.CENTER_HORIZONTAL);
                        editText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
                    }
                    dialog.show();

                    break;
            }
        }
    };

    private DialogListenerMessage categoryDialogListener = new DialogListenerMessage() {
        @Override
        public void onUpdateDialog(String text) {
            if (text != null && text.startsWith(STATS_TRAINER_PREFIX)) {
                // A trainer set was picked: only the times and graph pages change.
                String rest = text.substring(STATS_TRAINER_PREFIX.length());
                int split = rest.indexOf(':');
                try {
                    if (split > 0) {
                        TrainerScrambler.TrainerSubset picked =
                                TrainerScrambler.TrainerSubset.valueOf(rest.substring(0, split));
                        setStatsSubset(picked, rest.substring(split + 1));
                        // The Trainer tab follows the set picked here
                        setTrainerSubset(picked);
                    }
                } catch (IllegalArgumentException ignored) {
                }
                return;
            }
            currentPuzzleCategory = text;
            broadcast(CATEGORY_UI_INTERACTIONS, ACTION_CHANGED_CATEGORY);
        }
    };

    private ActionMode.Callback actionModeCallback = new ActionMode.Callback() {

        // Called when the action mode is created; startActionMode() was called
        @Override
        public boolean onCreateActionMode(ActionMode mode, Menu menu) {
            // Inflate a menu resource providing context menu items
            MenuInflater inflater = mode.getMenuInflater();
            inflater.inflate(R.menu.menu_list_callback, menu);

            return true;
        }

        // Called each time the action mode is shown. Always called after onCreateActionMode, but
        // may be called multiple times if the mode is invalidated.
        @Override
        public boolean onPrepareActionMode(ActionMode mode, Menu menu) {
            //if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                //getActivity().getWindow().setStatusBarColor(ThemeUtils.fetchAttrColor(mContext, R.attr.colorPrimaryDark));
            //}
            return true; // Return false if nothing is done
        }

        // Called when the user selects a contextual menu item
        @Override
        public boolean onActionItemClicked(ActionMode mode, MenuItem item) {
            switch (item.getItemId()) {
                case R.id.delete:
                    // Receiver will delete times and then broadcast "ACTION_TIMES_MODIFIED".
                    broadcast(CATEGORY_UI_INTERACTIONS, ACTION_DELETE_SELECTED_TIMES);
                    mode.finish();
                    return true;
                default:
                    return false;
            }
        }

        // Called when the user exits the action mode
        @Override
        public void onDestroyActionMode(ActionMode mode) {
        }
    };

    // Receives broadcasts about changes to the time user interface.
    private TTFragmentBroadcastReceiver mUIInteractionReceiver
            = new TTFragmentBroadcastReceiver(this, CATEGORY_UI_INTERACTIONS) {
        @Override
        public void onReceiveWhileAdded(Context context, Intent intent) {
            switch (intent.getAction()) {
                case ACTION_CHANGED_THEME:
                    try {
                        // If the theme has been changed, then the activity will need to be recreated. The
                        // theme can only be applied properly during the inflation of the layouts, so it has
                        // to go back to "Activity.updateLocale()" to do that.
                        ((MainActivity) getActivity()).onRecreateRequired();
                    } catch (Exception e) {}
                    break;
                case ACTION_TIMER_STARTED:
                    getMainActivity().setDrawerLock(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                    viewPager.setPagingEnabled(false);
                    activateTabLayout(false);
                    mToolbar.animate()
                            .translationY(-mToolbar.getHeight())
                            .alpha(0)
                            .setDuration(mAnimationDuration);

                    tabView.animate()
                             .translationY(tabView.getHeight())
                             .alpha(0)
                             .setDuration(mAnimationDuration);
                    break;

                case ACTION_TIMER_STOPPED:
                    getMainActivity().setDrawerLock(DrawerLayout.LOCK_MODE_UNDEFINED);
                    mToolbar.animate()
                            .translationY(0)
                            .alpha(1)
                            .setDuration(mAnimationDuration);

                    tabView.animate()
                            .translationY(0)
                            .alpha(1)
                            .setDuration(mAnimationDuration)
                            .withEndAction(() -> broadcast(CATEGORY_UI_INTERACTIONS, ACTION_TOOLBAR_RESTORED));

                    activateTabLayout(true);
                    if (pagerEnabled)
                        viewPager.setPagingEnabled(true);
                    else
                        viewPager.setPagingEnabled(false);
                    break;

                case ACTION_SELECTION_MODE_ON:
                    selectCount = 0;
                    actionMode = mToolbar.startActionMode(actionModeCallback);

                    break;

                case ACTION_SELECTION_MODE_OFF:
                    selectCount = 0;
                    if (actionMode != null)
                        actionMode.finish();
                    break;

                case ACTION_TIME_SELECTED:
                    selectCount += 1;
                    actionMode.setTitle(getResources().getQuantityString(R.plurals.selected_list, selectCount, selectCount));
                    break;

                case ACTION_TIME_UNSELECTED:
                    selectCount -= 1;
                    actionMode.setTitle(getResources().getQuantityString(R.plurals.selected_list, selectCount, selectCount));
                    break;

                case ACTION_CHANGED_CATEGORY:
                    mFragmentManager
                            .beginTransaction()
                            .replace(R.id.main_activity_container,
                                    TimerFragmentMain.newInstance(currentPuzzle, currentPuzzleCategory, currentMbldNum, "reset", currentTimerMode, currentPuzzleSubset, currentPage), "fragment_main")
                            .commit();

                    break;

                case ACTION_BLUETOOTH_CONNECTED:
                    navButtonBluetooth.setImageResource(R.drawable.ic_outline_bluetooth_connect_24px);
                    break;

                case ACTION_BLUETOOTH_DISCONNECTED:
                    navButtonBluetooth.setImageResource(R.drawable.ic_outline_bluetooth_24px);
                    break;

            }
        }
    };

    private Context mContext;
    private FragmentManager mFragmentManager;

    private int mAnimationDuration;

    @SuppressLint("StringFormatInvalid")
    private void updatePuzzleSpinnerHeader() {
        history = false;
        updateHistorySwitchItem();
        puzzleCategoryText.setText(currentPuzzleCategory.toLowerCase());
        if (currentTimerMode.equals(TIMER_MODE_TRAINER))
            puzzleNameText.setText(getString(R.string.title_trainer, TrainerSets.displayName(currentPuzzleSubset)));
        else
            puzzleNameText.setText(PuzzleUtils.getPuzzleTitle(mContext, currentPuzzle));
        puzzleNumber.setText(String.valueOf(currentMbldNum));
    }

    /** The WCA page's Results / Live switch, which lives in the top bar. */
    private com.hatopigeon.cubictimer.wca.WcaHostFragment findWcaHost() {
        for (Fragment f : getChildFragmentManager().getFragments()) {
            if (f instanceof com.hatopigeon.cubictimer.wca.WcaHostFragment) {
                return (com.hatopigeon.cubictimer.wca.WcaHostFragment) f;
            }
        }
        return null;
    }

    private void bindWcaSwitch() {
        if (mToolbar == null) return;
        TextView results = mToolbar.findViewById(R.id.wcaSwitchResults);
        TextView live = mToolbar.findViewById(R.id.wcaSwitchLive);
        if (results == null || live == null) return;
        results.setOnClickListener(v -> {
            com.hatopigeon.cubictimer.wca.WcaHostFragment host = findWcaHost();
            if (host != null) host.select(com.hatopigeon.cubictimer.wca.WcaHostFragment.SUB_RESULTS);
        });
        live.setOnClickListener(v -> {
            com.hatopigeon.cubictimer.wca.WcaHostFragment host = findWcaHost();
            if (host != null) host.select(com.hatopigeon.cubictimer.wca.WcaHostFragment.SUB_LIVE);
        });
        com.hatopigeon.cubictimer.wca.WcaHostFragment host = findWcaHost();
        updateWcaSwitch(host != null ? host.getSub() : com.hatopigeon.cubictimer.wca.WcaHostFragment.SUB_RESULTS);
    }

    /** Highlights Results or Live in the top bar. Called by the WCA page when it switches. */
    public void updateWcaSwitch(int sub) {
        if (mToolbar == null) return;
        TextView results = mToolbar.findViewById(R.id.wcaSwitchResults);
        TextView live = mToolbar.findViewById(R.id.wcaSwitchLive);
        if (results == null || live == null) return;
        boolean r = sub == com.hatopigeon.cubictimer.wca.WcaHostFragment.SUB_RESULTS;
        results.setBackgroundResource(r ? R.drawable.bg_wca_switch_selected : 0);
        live.setBackgroundResource(r ? 0 : R.drawable.bg_wca_switch_selected);
        results.setAlpha(r ? 1f : 0.55f);
        live.setAlpha(r ? 0.55f : 1f);
    }

    /** Puts the Timer tab's puzzle and category back into the title, after leaving the Trainer tab. */
    private void updatePuzzleSpinnerHeaderText() {
        if (puzzleCategoryText == null || puzzleNameText == null) return;
        puzzleCategoryText.setText(currentPuzzleCategory.toLowerCase());
        if (currentTimerMode.equals(TIMER_MODE_TRAINER))
            puzzleNameText.setText(getString(R.string.title_trainer, TrainerSets.displayName(currentPuzzleSubset)));
        else
            puzzleNameText.setText(PuzzleUtils.getPuzzleTitle(mContext, currentPuzzle));
    }

    /** Shows the trainer set in the title, for example "OLL trainer". */
    private void updateTrainerHeader() {
        if (puzzleCategoryText == null || puzzleNameText == null) return;
        puzzleNameText.setText(getString(R.string.title_trainer, TrainerSets.displayName(trainerSubset)));
        puzzleCategoryText.setText(trainerCategory().toLowerCase());
    }

    /** Shows the trainer set in the title while the times or graph page is looking at it. */
    private void updateStatsHeader() {
        if (puzzleCategoryText == null || puzzleNameText == null || statsSubset == null) return;
        puzzleNameText.setText(getString(R.string.title_trainer, TrainerSets.displayName(statsSubset)));
        puzzleCategoryText.setText(
                com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL.equals(statsGroup)
                        ? getString(R.string.trainer_stats_all) : statsGroup.toLowerCase());
    }

    /** True while the times or graph page is the one on screen. */
    private boolean onStatsPages() {
        return viewPager != null
                && (viewPager.getCurrentItem() == LIST_PAGE || viewPager.getCurrentItem() == GRAPH_PAGE);
    }

    /** Asks which group of the open trainer set the times and graph pages should show. */
    private void showStatsGroupDialog() {
        final TrainerScrambler.TrainerSubset set = statsSubset;
        if (set == null) return;
        final List<String> groups = TrainerSets.groupNames(set);
        final List<String> choices = new java.util.ArrayList<>();
        choices.add(getString(R.string.trainer_all_cases, TrainerSets.displayName(set)));
        choices.addAll(groups);
        ThemeUtils.roundAndShowDialog(mContext, new MaterialDialog.Builder(mContext)
                .title(R.string.trainer_pick_group)
                .items(choices)
                .itemsCallback((dialog, itemView, which, text) ->
                        setStatsSubset(set, which == 0
                                ? com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL
                                : groups.get(which - 1)))
                .build());
    }

    /** What the times and graph pages are showing: the Timer tab's puzzle, or a trainer set. */
    private String statsPuzzle() {
        return statsSubset != null ? statsSubset.name() : currentPuzzle;
    }

    private String statsCategory() {
        return statsSubset != null ? statsGroup : currentPuzzleCategory;
    }

    /** Refreshes the pager, then points the times and graph pages at what they should show. */
    private void refreshPages() {
        viewPagerAdapter.notifyDataSetChanged();
        applyStatsScope();
    }

    /** Points the times and graph pages at the current puzzle or trainer set, without rebuilding them. */
    private void applyStatsScope() {
        if (!isAdded()) return;
        for (Fragment f : getChildFragmentManager().getFragments()) {
            if (f instanceof TimerListFragment) {
                ((TimerListFragment) f).rescope(statsPuzzle(), statsCategory(), currentMbldNum, currentScramble);
            } else if (f instanceof TimerGraphFragment) {
                ((TimerGraphFragment) f).rescope(statsPuzzle(), statsCategory());
            }
        }
    }

    /** The last of the Timer and Trainer tabs that was open, or -1. The stats pages follow it. */
    private int lastMainTab = -1;

    /** Points the times and graph pages at what the last open Timer or Trainer tab is on. */
    private void syncStatsToTab() {
        if (viewPager == null || viewPagerAdapter == null || !isAdded()) return;
        if (lastMainTab == TIMER_PAGE) {
            setStatsSubset(null, null);
        } else if (lastMainTab == TRAINER_PAGE) {
            setStatsSubset(trainerSubset, trainerSubset == statsSubset
                    ? statsGroup : com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL);
        }
    }

    /** Points the times and graph pages at a trainer set (or back at the puzzle with null). */
    private void setStatsSubset(TrainerScrambler.TrainerSubset subset, String group) {
        if (subset == statsSubset && java.util.Objects.equals(group, statsGroup)) return;
        statsSubset = subset;
        statsGroup = group != null ? group : com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL;
        // Rebuilds only the times and graph pages, see NavigationAdapter.getItemPosition.
        refreshPages();
        // Only touch the top bar while a stats page is showing: on the Timer and Trainer tabs it
        // belongs to that tab, and the stats header is drawn when the stats pages open.
        int shown = viewPager != null ? viewPager.getCurrentItem() : currentPage;
        if (shown == LIST_PAGE || shown == GRAPH_PAGE) {
            if (statsSubset != null) updateStatsHeader(); else updatePuzzleSpinnerHeaderText();
        }
        if (viewPager != null) updateStatsModeButton(shown);
    }

    // ---- Trainer categories: separate case selections for one set, chosen from the top bar ----

    private static final String PREF_TRAINER_CATEGORY = "ztimer_trainer_category_";
    private static final String PREF_TRAINER_CATEGORIES = "ztimer_trainer_categories_";

    /** The trainer category of the open set. */
    private String trainerCategory() {
        return PreferenceManager.getDefaultSharedPreferences(mContext)
                .getString(PREF_TRAINER_CATEGORY + trainerSubset.name(), TRAINER_CATEGORY);
    }

    private List<String> trainerCategories() {
        java.util.Set<String> saved = PreferenceManager.getDefaultSharedPreferences(mContext)
                .getStringSet(PREF_TRAINER_CATEGORIES + trainerSubset.name(), new java.util.HashSet<String>());
        List<String> list = new ArrayList<>(saved);
        list.remove(TRAINER_CATEGORY);
        java.util.Collections.sort(list, String.CASE_INSENSITIVE_ORDER);
        list.add(0, TRAINER_CATEGORY);
        return list;
    }

    private void saveTrainerCategories(List<String> categories) {
        PreferenceManager.getDefaultSharedPreferences(mContext).edit()
                .putStringSet(PREF_TRAINER_CATEGORIES + trainerSubset.name(), new java.util.HashSet<>(categories)).apply();
    }

    private void selectTrainerCategory(String category) {
        if (category.equals(trainerCategory())) return;
        PreferenceManager.getDefaultSharedPreferences(mContext).edit()
                .putString(PREF_TRAINER_CATEGORY + trainerSubset.name(), category).apply();
        updateTrainerHeader();
        // Rebuilds only the trainer page, see NavigationAdapter.getItemPosition.
        refreshPages();
    }

    /** The category popup of the Trainer page, the same one the Timer has. */
    private void showTrainerCategoryDialog() {
        com.hatopigeon.cubictimer.fragment.dialog.TrainerCategoryDialog dialog =
                com.hatopigeon.cubictimer.fragment.dialog.TrainerCategoryDialog.newInstance();
        dialog.setHost(new com.hatopigeon.cubictimer.fragment.dialog.TrainerCategoryDialog.Host() {
            @Override
            public List<String> categories() {
                return trainerCategories();
            }

            @Override
            public void onAdd(String name) {
                List<String> all = trainerCategories();
                if (!all.contains(name)) all.add(name);
                saveTrainerCategories(all);
                selectTrainerCategory(name);
            }

            @Override
            public void onSelect(String name) {
                selectTrainerCategory(name);
            }

            @Override
            public void onRename(String oldName, String newName) {
                if (newName.isEmpty() || newName.equals(oldName)) return;
                TrainerScrambler.renameCategory(trainerSubset, oldName, newName);
                List<String> all = trainerCategories();
                all.remove(oldName);
                if (!all.contains(newName)) all.add(newName);
                saveTrainerCategories(all);
                if (oldName.equals(trainerCategory())) selectTrainerCategory(newName);
            }

            @Override
            public void onRemove(String name) {
                List<String> all = trainerCategories();
                all.remove(name);
                saveTrainerCategories(all);
                if (name.equals(trainerCategory())) selectTrainerCategory(TRAINER_CATEGORY);
            }
        });
        dialog.show(mFragmentManager, "trainer_category_dialog");
    }

    /** The cases button is only there for sets that have cases to choose from. */
    private void updateCasesButton() {
        if (navButtonCases == null || viewPager == null) return;
        boolean show = viewPager.getCurrentItem() == TRAINER_PAGE && TrainerSets.hasChoosableCases(trainerSubset);
        fade(navButtonCases, show);
    }

    /** One tap on the stats pages: switch between the Timer's solves and the Trainer's solves. */
    private void updateStatsModeButton(int pageNum) {
        if (navButtonStatsMode == null) return;
        boolean stats = pageNum == LIST_PAGE || pageNum == GRAPH_PAGE;
        fade(navButtonStatsMode, stats);
        if (!stats) return;
        boolean showingTrainer = statsSubset != null;
        navButtonStatsMode.setImageResource(showingTrainer ? R.drawable.ic_outline_timer_24px : R.drawable.ic_outline_control_camera_24px);
        navButtonStatsMode.setContentDescription(getString(showingTrainer ? R.string.stats_switch_to_timer : R.string.stats_switch_to_trainer));
        navButtonStatsMode.setOnClickListener(v -> {
            if (statsSubset != null) setStatsSubset(null, null);
            else setStatsSubset(trainerSubset, com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL);
            updateStatsModeButton(viewPager.getCurrentItem());
        });
    }

    /** Switches the Trainer tab to another set. The Timer tab is not touched. */
    public void setTrainerSubset(TrainerScrambler.TrainerSubset subset) {
        if (subset == trainerSubset) return;
        trainerSubset = subset;
        // While the Trainer tab is the one open, the stats pages follow its set (rebuilt below)
        if (lastMainTab == TRAINER_PAGE && statsSubset != null && statsSubset != subset) {
            statsSubset = subset;
            statsGroup = com.hatopigeon.cubictimer.database.DatabaseHandler.SUBTYPE_ALL;
        }
        PreferenceManager.getDefaultSharedPreferences(mContext).edit()
                .putString(PREF_TRAINER_SUBSET, subset.name()).apply();
        updateTrainerHeader();
        updateCasesButton();
        // Rebuilds only the trainer page, see NavigationAdapter.getItemPosition.
        refreshPages();
    }

    /** Asks which trainer set to practise. The sets are sorted into families. */
    /** A trainer solve that is being retried from the times list, until the Trainer tab picks it up. */
    private String pendingTrainerScramble;
    private String pendingTrainerGroup;

    /**
     * "Use this scramble" on a trainer solve: opens the Trainer tab on that solve's set and puts the
     * scramble in the trainer, not in the Timer tab.
     */
    public void retrySolveInTrainer(final com.hatopigeon.cubictimer.items.Solve solve) {
        final TrainerScrambler.TrainerSubset set;
        try {
            set = TrainerScrambler.TrainerSubset.valueOf(solve.getPuzzle());
        } catch (IllegalArgumentException e) {
            return;
        }
        if (viewPager == null) return;
        pendingTrainerScramble = solve.getScramble();
        pendingTrainerGroup = solve.getSubtype();
        boolean sameSet = set == trainerSubset;
        // Another set rebuilds the trainer page, which picks the scramble up when it starts
        if (!sameSet) setTrainerSubset(set);
        viewPager.setCurrentItem(TRAINER_PAGE, true);
        if (sameSet) {
            // The trainer is already there: hand it the scramble once the page has switched
            viewPager.postDelayed(() -> new com.hatopigeon.cubictimer.utils.TTIntent.BroadcastBuilder(
                    CATEGORY_UI_INTERACTIONS, com.hatopigeon.cubictimer.utils.TTIntent.ACTION_SET_SCRAMBLE)
                    .solve(solve)
                    .broadcast(), 350);
        }
        // Forget it after a while, in case nobody asked for it
        viewPager.postDelayed(() -> { pendingTrainerScramble = null; pendingTrainerGroup = null; }, 3000);
    }

    /**
     * "Use this scramble" on a Timer solve: puts the scramble in the Timer tab and goes there,
     * the same way a trainer solve goes back to the Trainer tab.
     */
    public void retrySolveInTimer(final com.hatopigeon.cubictimer.items.Solve solve) {
        if (viewPager == null) return;
        // Go to the Timer tab first so its timer is the one that reacts to the scramble
        viewPager.setCurrentItem(TIMER_PAGE, true);
        viewPager.postDelayed(() -> new com.hatopigeon.cubictimer.utils.TTIntent.BroadcastBuilder(
                CATEGORY_UI_INTERACTIONS, com.hatopigeon.cubictimer.utils.TTIntent.ACTION_SET_SCRAMBLE)
                .solve(solve)
                .broadcast(), 350);
    }

    /** The scramble and group of a retried trainer solve ({scramble, group}), once, or null. */
    public String[] takePendingTrainerRetry() {
        if (pendingTrainerScramble == null) return null;
        String[] result = {pendingTrainerScramble, pendingTrainerGroup};
        pendingTrainerScramble = null;
        pendingTrainerGroup = null;
        return result;
    }

    private void showTrainerMenu() {
        PuzzleSelectDialog trainerSelectDialog = PuzzleSelectDialog.newTrainerInstance(trainerSubset.name());
        trainerSelectDialog.setDialogListener(this);
        trainerSelectDialog.show(mFragmentManager, TAG_PUZZLE_DIALOG);
    }

    public TimerFragmentMain() {
        // Required empty public constructor
    }

    public static TimerFragmentMain newInstance(String puzzle, String category, int mbldNum, String scramble, String mode, TrainerScrambler.TrainerSubset subset, int page) {
        final TimerFragmentMain fragment = new TimerFragmentMain();
        Bundle args = new Bundle();
        args.putString(PUZZLE, puzzle);
        args.putString(PUZZLE_SUBTYPE, category);
        args.putInt(MBLD_NUM, mbldNum);
        args.putString(SCRAMBLE, scramble);
        args.putString(TIMER_MODE, mode);
        args.putSerializable(TRAINER_SUBSET, subset);
        args.putInt(PAGE, page);
        fragment.setArguments(args);
        if (DEBUG_ME) Log.d(TAG, "newInstance() -> " + fragment);
        return fragment;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        if (DEBUG_ME) Log.d(TAG, "onSaveInstanceState()");
        super.onSaveInstanceState(outState);
        outState.putString("puzzle", currentPuzzle);
        outState.putString("subtype", currentPuzzleCategory);
        outState.putInt("mbld_num", currentMbldNum);
        outState.putString("scramble", currentScramble);
        outState.putSerializable("subset", currentPuzzleSubset);
        outState.putString("mode", currentTimerMode);
        outState.putBoolean("history", history);
        outState.putSerializable("stats_subset", statsSubset);
        outState.putString("stats_group", statsGroup);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        if (DEBUG_ME) Log.d(TAG, "onCreate(savedInstanceState=" + savedInstanceState + ")");
        super.onCreate(savedInstanceState);

        mContext = getContext();
        mFragmentManager = getFragmentManager();

        try {
            trainerSubset = TrainerScrambler.TrainerSubset.valueOf(
                    PreferenceManager.getDefaultSharedPreferences(mContext)
                            .getString(PREF_TRAINER_SUBSET, TrainerScrambler.TrainerSubset.OLL.name()));
        } catch (IllegalArgumentException e) {
            trainerSubset = TrainerScrambler.TrainerSubset.OLL;
        }

        if (savedInstanceState != null) {
            statsSubset = (TrainerScrambler.TrainerSubset) savedInstanceState.getSerializable("stats_subset");
            String savedGroup = savedInstanceState.getString("stats_group");
            if (savedGroup != null) statsGroup = savedGroup;
        }

        // Retrieve arguments
        if (getArguments() != null) {
            currentPuzzle = getArguments().getString(PUZZLE);
            currentPuzzleCategory = getArguments().getString(PUZZLE_SUBTYPE);
            currentMbldNum = getArguments().getInt(MBLD_NUM);
            currentScramble = getArguments().getString(SCRAMBLE);

            currentTimerMode = getArguments().getString(TIMER_MODE);
            currentPuzzleSubset = (TrainerScrambler.TrainerSubset) getArguments().getSerializable(TRAINER_SUBSET);
            currentPage = getArguments().getInt(PAGE);
        }

        // Retrieve instance state
        if (savedInstanceState != null) {
            currentPuzzle = savedInstanceState.getString("puzzle");
            currentPuzzleCategory = savedInstanceState.getString("subtype");
            currentMbldNum = savedInstanceState.getInt("mbld_num");
            currentScramble = savedInstanceState.getString("scramble");
            currentTimerMode = savedInstanceState.getString("mode", TimerFragment.TIMER_MODE_TIMER);
            currentPuzzleSubset = (TrainerScrambler.TrainerSubset) savedInstanceState.getSerializable("subset");
            history = savedInstanceState.getBoolean("history");

            // Set the dialog listeners again, in case the dialogs are open.
            categoryDialog = (CategorySelectDialog) mFragmentManager
                    .findFragmentByTag(TAG_CATEGORY_DIALOG);
            if (categoryDialog != null)
                categoryDialog.setDialogListener(categoryDialogListener);

            PuzzleSelectDialog selectDialog = (PuzzleSelectDialog) mFragmentManager
                    .findFragmentByTag(TAG_PUZZLE_DIALOG);
            if (selectDialog != null)
                selectDialog.setDialogListener(this);
        }

        mAnimationDuration = Prefs.getInt(R.string.pk_timer_animation_duration, mContext.getResources().getInteger(R.integer.defaultAnimationDuration));
    }

    @Override
    public View onCreateView(final LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        if (DEBUG_ME) Log.d(TAG, "onCreateView(savedInstanceState=" + savedInstanceState + ")");
        View root = inflater.inflate(R.layout.fragment_timer_main, container, false);
        mUnbinder = ButterKnife.bind(this, root);

        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        GradientDrawable grad = ThemeUtils.fetchBackgroundGradient(mContext, ThemeUtils.getPreferredTheme());

        bgImageEnabled = Prefs.getBoolean(R.string.pk_bg_image_enabled, false);

        if (bgImageEnabled) {
            if (applyBackgroundImage()) {
                colorOverlayOpacity = Prefs.getInt(R.string.pk_bg_image_opacity,
                        mContext.getResources().getInteger(R.integer.defaultColorOverlayOpacity)) * 255 / 100;
                colorOverlayOpacity = Math.max(0, Math.min(colorOverlayOpacity, 255));
                grad.setAlpha(colorOverlayOpacity);
            }
        } else {
            bgImage.setImageDrawable(null);
        }
        bgGradientOverlay.setBackground(grad);

        InsetsUtils.applySafeInsetsPadding(rootLayout, false);

        // Since windowLightNavigationBar is not supported below API level 27,
        // set a dark navigation bar color to maintain contrast with light themes
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O_MR1 &&
                !Prefs.getBoolean(R.string.pk_tint_navigation_bar, false)) {
            Activity activity = requireActivity();
            Window window = activity.getWindow();
            if (window != null) {
                window.setNavigationBarColor(0xB3000000);
            }
        }

        navButtonCategory.setOnClickListener(clickListener);
        navButtonCases.setOnClickListener(v -> {
            BottomSheetTrainerDialog sheet = BottomSheetTrainerDialog.newInstance(trainerSubset, trainerCategory());
            sheet.show(mFragmentManager, "trainer_dialog_fragment");
        });
        navButtonHistory.setOnClickListener(clickListener);
        navButtonSettings.setOnClickListener(clickListener);
        navButtonBluetooth.setOnClickListener(clickListener);
        puzzleNumber.setOnClickListener(clickListener);

        if (savedInstanceState == null) {
            // Remember last used puzzle
            currentPuzzle = Prefs.getString(R.string.pk_last_used_puzzle, PuzzleUtils.TYPE_333);
            updateCurrentCategory();
            currentMbldNum = Prefs.getInt(R.string.pk_last_used_mbld_num, 5);
            if (currentScramble.equals("reset")) {
                currentScramble = "";
                Prefs.edit().putString(R.string.pk_last_used_scramble, "").apply();
            } else {
                currentScramble = Prefs.getString(R.string.pk_last_used_scramble, "");
            }
        }
        if (currentScramble.equals("reset")) {
            // not reachable, just in case
            currentScramble = "";
            Prefs.edit().putString(R.string.pk_last_used_scramble, "").apply();
        }

        pagerEnabled = PreferenceManager.getDefaultSharedPreferences(mContext).getBoolean(
                getString(R.string.pk_tab_swiping_enabled), true);

        viewPager.setPagingEnabled(pagerEnabled);

        smartTimerEnabled = Prefs.getBoolean(R.string.pk_smart_timer_enabled, true);
        if (!smartTimerEnabled || isTimeDisabled(currentPuzzle)) {
            navButtonBluetooth.setVisibility(View.GONE);
        }

        if (currentPuzzle.equals(PuzzleUtils.TYPE_333MBLD)) {
            puzzleNumber.setVisibility(View.VISIBLE);
        }

        // Menu bar background
        if (Prefs.getBoolean(R.string.pk_menu_background, false)) {
            mToolbar.setCardBackgroundColor(Color.TRANSPARENT);
            mToolbar.setCardElevation(0);
        }

        viewPagerAdapter = new NavigationAdapter(getChildFragmentManager());
        viewPager.setAdapter(viewPagerAdapter);
        viewPager.setOffscreenPageLimit(NUM_PAGES - 1);
        viewPager.setCurrentItem(currentPage);
        if (currentPage == TIMER_PAGE || currentPage == TRAINER_PAGE) lastMainTab = currentPage;
        tabLayout.setupWithViewPager(viewPager);
        tabLayout.setSelectedTabIndicator(0);
        tabLayout.setTabIconTint(AppCompatResources.getColorStateList(mContext, R.color.tab_color));
        tabStrip = ((LinearLayout) tabLayout.getChildAt(0));

        // Tab bar background
        if (Prefs.getBoolean(R.string.pk_tab_background, false)) {
            tabLayout.setBackground(null);
            tabBackground.setVisibility(View.INVISIBLE);
        } else {
            tabLayout.getBackground().setColorFilter(ThemeUtils.fetchAttrColor(mContext, R.attr.colorTabBar), PorterDuff.Mode.SRC_IN);
        }

        // Handle spinner AFTER reading from savedInstanceState, so we can correctly
        // fill the category field in the spinner
        handleHeaderSpinner();

        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                // The times and graph pages show whatever the Timer or Trainer tab is on. They are
                // pointed at it as soon as one of those tabs is reached (after the swipe has
                // settled), so there is nothing left to rebuild when the stats pages open.
                if (position == TIMER_PAGE || position == TRAINER_PAGE) {
                    lastMainTab = position;
                    viewPager.post(() -> syncStatsToTab());
                } else if (position == LIST_PAGE || position == GRAPH_PAGE) {
                    syncStatsToTab(); // does nothing if it already happened
                }
                setupPage(position);
                currentPage = position;
            }

            @Override
            public void onPageScrollStateChanged(int state) {
                broadcast(CATEGORY_UI_INTERACTIONS, ACTION_SCROLLED_PAGE);
            }
        });

        // Register a receiver to update if something has changed
        registerReceiver(mUIInteractionReceiver);
    }

    private boolean applyBackgroundImage() {
        try {
            int orientation = getResources().getConfiguration().orientation;
            int key = (orientation == Configuration.ORIENTATION_PORTRAIT)
                    ? R.string.pk_bg_image_portrait : R.string.pk_bg_image_landscape;

            String path = Prefs.getString(key, null);

            if (TextUtils.isEmpty(path) || !new File(path).exists()) {
                if (isAdded()) {
                    Glide.with(this).clear(bgImage);
                    bgImage.setImageDrawable(null);
                }
                return false;
            }

            File f = new File(path);
            RequestOptions opts = new RequestOptions()
                    .centerCrop()
                    .signature(new ObjectKey(f.lastModified()));

            if (isAdded()) {
                Glide.with(this)
                        .load(f)
                        .apply(opts)
                        .into(bgImage);
            }

            return true;

        } catch (Exception e) {
            e.printStackTrace();
            try {
                if (isAdded()) {
                    Glide.with(this).clear(bgImage);
                    bgImage.setImageDrawable(null);
                }
            } catch (Exception ignored) {}
            return false;
        }
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        handleStatisticsLoader();

    }

    private void handleStatisticsLoader() {
        // The "StatisticsLoader" is managed from this fragment, as it has the necessary access to
        // the puzzle type, subtype and history values.
        //
        // "restartLoader" ensures that any old loader with the wrong puzzle type/subtype will not
        // be reused. For now, those arguments are just passed via their respective fields to
        // "onCreateLoader".

        if (DEBUG_ME)
            Log.d(TAG, "Puzzle and subtype: " + currentPuzzle + " // " + currentPuzzleCategory);
        if (DEBUG_ME) Log.d(TAG, "onActivityCreated -> restartLoader: STATISTICS_LOADER_ID");
        final String statsPuzzle = currentPuzzle;
        final String statsCategory = currentPuzzleCategory;
        getLoaderManager().restartLoader(MainActivity.STATISTICS_LOADER_ID, null,
                                         new LoaderManager.LoaderCallbacks<Wrapper<Statistics>>() {
                                             @Override
                                             public Loader<Wrapper<Statistics>> onCreateLoader(int id, Bundle args) {
                                                 if (DEBUG_ME)
                                                     Log.d(TAG, "onCreateLoader: STATISTICS_LOADER_ID");
                                                 return new StatisticsLoader(mContext, Statistics.newAllTimeStatistics(statsPuzzle),
                                                                             statsPuzzle, statsCategory);
                                             }

                                             @Override
                                             public void onLoadFinished(Loader<Wrapper<Statistics>> loader,
                                                                        Wrapper<Statistics> data) {
                                                 if (DEBUG_ME)
                                                     Log.d(TAG, "onLoadFinished: STATISTICS_LOADER_ID");
                                                 // Other fragments can get the statistics from the cache when they are
                                                 // created and can register themselves as observers of further updates.
                                                 StatisticsCache.getInstance().updateAndNotify(data.content());
                                             }

                                             @Override
                                             public void onLoaderReset(Loader<Wrapper<Statistics>> loader) {
                                                 if (DEBUG_ME)
                                                     Log.d(TAG, "onLoaderReset: STATISTICS_LOADER_ID");
                                                 // Clear the cache and notify all observers that the statistics are "null".
                                                 StatisticsCache.getInstance().updateAndNotify(null);
                                             }
                                         });
    }

    private void activateTabLayout(boolean b) {
        tabStrip.setEnabled(b);
        for (int i = 0; i < tabStrip.getChildCount(); i++) {
            tabStrip.getChildAt(i).setClickable(b);
        }
    }

    @Override
    public void onResume() {
        if (DEBUG_ME) Log.d(TAG, "onResume() : currentPage=" + currentPage);
        // Sets up the toolbar with the icons appropriate to the current page.
        mToolbar.post(() -> setupPage(currentPage));
        super.onResume();
    }

    @Override
    public void onDetach() {
        if (DEBUG_ME) Log.d(TAG, "onDetach()");
        super.onDetach();
        unregisterReceiver(mUIInteractionReceiver);
    }

    @Override
    public void onDestroyView() {
        if (bgImage != null) {
            Glide.with(this).clear(bgImage);
            bgImage = null;
        }
        bgGradientOverlay = null;

        super.onDestroyView();
        mUnbinder.unbind();
    }

    private void updateHistorySwitchItem() {
        if (history) {
            navButtonHistory.setImageResource(R.drawable.ic_history_on);
            navButtonHistory.animate()
                    .rotation(-135)
                    .setInterpolator(new AccelerateDecelerateInterpolator())
                    .setDuration(300)
                    .start();
        } else {
            navButtonHistory.setImageResource(R.drawable.ic_history_off);
            navButtonHistory.animate()
                    .rotation(0)
                    .setInterpolator(new AccelerateDecelerateInterpolator())
                    .setDuration(300)
                    .start();
        }
    }

    /** Fades a top bar item in or out, the same way the other bar buttons change. */
    private void fade(final View v, boolean show) {
        if (v == null) return;
        v.animate().cancel();
        if (show) {
            if (v.getVisibility() != View.VISIBLE) {
                v.setAlpha(0f);
                v.setVisibility(View.VISIBLE);
            }
            v.animate().alpha(1f).setDuration(200).start();
        } else if (v.getVisibility() != View.GONE) {
            v.animate().alpha(0f).setDuration(200).withEndAction(() -> v.setVisibility(View.GONE)).start();
        }
    }

    /**
     * Sets the page's toolbar buttons and other things
     *
     * @param pageNum
     */
    private void setupPage(int pageNum) {
        if (DEBUG_ME) Log.d(TAG, "setupPage(pageNum=" + pageNum + ")");

        if (actionMode != null)
            actionMode.finish();

        if (mToolbar == null) {
            return;
        }

        // The top bar stays on every page. The WCA page swaps the puzzle picker for its own title and
        // shows the records and rankings shortcuts. The Trainer page keeps the picker, but it picks
        // the trainer set instead of a puzzle.
        boolean wca = pageNum == WCA_PAGE;
        boolean trainer = pageNum == TRAINER_PAGE;
        mToolbar.setVisibility(View.VISIBLE);
        updateStatsModeButton(pageNum);

        View wcaTitle = mToolbar.findViewById(R.id.wcaSwitch);
        View recordsBtn = mToolbar.findViewById(R.id.nav_button_records);
        View rankingsBtn = mToolbar.findViewById(R.id.nav_button_rankings);
        if (wcaTitle != null && recordsBtn != null && rankingsBtn != null) {
            fade(wcaTitle, wca);
            fade(recordsBtn, wca);
            fade(rankingsBtn, wca);
            fade(puzzleSpinnerLayout, !wca);
            fade(navButtonCategory, !wca);
            fade(navButtonCases, trainer && TrainerSets.hasChoosableCases(trainerSubset));
            if (wca) {
                bindWcaSwitch();
                recordsBtn.setOnClickListener(v -> startActivity(new android.content.Intent(requireContext(),
                        com.hatopigeon.cubictimer.activity.RecordsActivity.class)));
                rankingsBtn.setOnClickListener(v -> startActivity(new android.content.Intent(requireContext(),
                        com.hatopigeon.cubictimer.activity.RankingsActivity.class)));
                fade(navButtonHistory, false);
                fade(navButtonBluetooth, false);
                fade(puzzleNumber, false);
                return;
            }
        }

        if (trainer) {
            updateTrainerHeader();
            fade(navButtonHistory, false);
            fade(navButtonBluetooth, false);
            fade(puzzleNumber, false);
            return;
        }
        if (statsSubset != null && (pageNum == LIST_PAGE || pageNum == GRAPH_PAGE)) {
            updateStatsHeader();
        } else {
            updatePuzzleSpinnerHeaderText();
        }

        switch (pageNum) {
            case TIMER_PAGE:
                if (navButtonHistory != null) {
                    navButtonHistory.animate()
                            .withStartAction(() -> navButtonHistory.setEnabled(false))
                            .alpha(0)
                            .setDuration(200)
                            .withEndAction(() -> {
                                // navButtonHistory may already be destroyed by the time we get
                                // to the end action, so we have to check if it still exists
                                if (navButtonHistory != null) navButtonHistory.setVisibility(View.GONE);
                            })
                            .start();
                }

                if (navButtonBluetooth != null && smartTimerEnabled
                        && !isTimeDisabled(currentPuzzle)) {
                    navButtonBluetooth.setVisibility(View.VISIBLE);
                    navButtonBluetooth.animate()
                            .withStartAction(() -> navButtonBluetooth.setEnabled(true))
                            .alpha(1)
                            .setDuration(200)
                            .start();
                }

                if (puzzleNumber != null && currentPuzzle.equals(PuzzleUtils.TYPE_333MBLD)) {
                    puzzleNumber.setVisibility(View.VISIBLE);
                    puzzleNumber.animate()
                            .withStartAction(() -> puzzleNumber.setEnabled(true))
                            .alpha(1)
                            .setDuration(200)
                            .start();
                }
                break;

            case LIST_PAGE:
            case GRAPH_PAGE:
                if (navButtonHistory != null) {
                    navButtonHistory.setVisibility(View.VISIBLE);
                    navButtonHistory.animate()
                            .withStartAction(() -> navButtonHistory.setEnabled(true))
                            .alpha(1)
                            .setDuration(200)
                            .start();
                }
                if (navButtonBluetooth != null) {
                    navButtonBluetooth.animate()
                            .withStartAction(() -> navButtonBluetooth.setEnabled(false))
                            .alpha(0)
                            .setDuration(200)
                            .withEndAction(() -> {
                                // navButtonBluetooth may already be destroyed by the time we get
                                // to the end action, so we have to check if it still exists
                                if (navButtonBluetooth != null) navButtonBluetooth.setVisibility(View.GONE);
                            })
                            .start();
                }
                if (puzzleNumber != null) {
                    puzzleNumber.animate()
                            .withStartAction(() -> puzzleNumber.setEnabled(false))
                            .alpha(0)
                            .setDuration(200)
                            .withEndAction(() -> {
                                // puzzleNumber may already be destroyed by the time we get
                                // to the end action, so we have to check if it still exists
                                if (puzzleNumber != null) puzzleNumber.setVisibility(View.GONE);
                            })
                            .start();
                }
                break;
        }
    }

    /**
     * The app saves the last subtype used for each puzzle. This function is called to both update
     * the last subtype when it's changed, and to set the subtipe.
     */
    private void updateCurrentCategory() {
        SharedPreferences        sharedPreferences = PreferenceManager.getDefaultSharedPreferences(CubicTimer.getAppContext());
        SharedPreferences.Editor editor            = sharedPreferences.edit();
        final List<String> subtypeList
                = CubicTimer.getDBHandler().getAllSubtypesFromType(currentPuzzle);
        if (subtypeList.size() == 0) {
            currentPuzzleCategory = "Normal";
            editor.putString(getString(R.string.pk_last_used_category) + currentPuzzle, "Normal");
            editor.apply();
        } else {
            currentPuzzleCategory = sharedPreferences.getString(getString(R.string.pk_last_used_category) + currentPuzzle, "Normal");
        }
    }

    private void handleHeaderSpinner() {


        // Setup action bar click listener
        puzzleSpinnerLayout.setOnClickListener(v -> {
            if (viewPager != null && viewPager.getCurrentItem() == TRAINER_PAGE) {
                showTrainerMenu();
            } else if (statsSubset != null && onStatsPages()) {
                // Trainer stats: the puzzle popup lists the trainer sets instead of puzzles
                PuzzleSelectDialog trainerSelectDialog = PuzzleSelectDialog.newTrainerInstance(statsSubset.name());
                trainerSelectDialog.setDialogListener(this);
                trainerSelectDialog.show(mFragmentManager, TAG_PUZZLE_DIALOG);
            } else if (currentTimerMode.equals(TimerFragment.TIMER_MODE_TRAINER)) {
                BottomSheetTrainerDialog bottomSheetTrainerDialog = BottomSheetTrainerDialog.newInstance(currentPuzzleSubset, currentPuzzleCategory);
                bottomSheetTrainerDialog.show(mFragmentManager, "trainer_dialog_fragment");
            }
            else {
                // Setup spinner dialog and adapter
                PuzzleSelectDialog puzzleSelectDialog = PuzzleSelectDialog.newInstance();
                puzzleSelectDialog.setDialogListener(this);
                puzzleSelectDialog.show(mFragmentManager, TAG_PUZZLE_DIALOG);
            }
        });

        updatePuzzleSpinnerHeader();
        updateBluetoothButton();
    }

    private void updateBluetoothButton() {
        if (currentPage == TIMER_PAGE) {
            if (!smartTimerEnabled || isTimeDisabled(currentPuzzle)) {
                navButtonBluetooth.animate()
                        .withStartAction(() -> navButtonBluetooth.setEnabled(false))
                        .alpha(0)
                        .setDuration(200)
                        .withEndAction(() -> {
                            // navButtonBluetooth may already be destroyed by the time we get
                            // to the end action, so we have to check if it still exists
                            if (navButtonBluetooth != null) navButtonBluetooth.setVisibility(View.GONE);
                        })
                        .start();
            } else {
                navButtonBluetooth.setVisibility(View.VISIBLE);
                navButtonBluetooth.animate()
                        .withStartAction(() -> navButtonBluetooth.setEnabled(true))
                        .alpha(1)
                        .setDuration(200)
                        .start();
            }
        }
    }

    // A new puzzle has been selected
    @Override
    public void onUpdateDialog(String text) {
        // to avoid IllegalStateException on getString that reported by Android Vitals
        if (getActivity() == null) {
            return;
        }

        // A trainer set picked in the puzzle popup: only the times and graph pages change
        if (text != null && text.startsWith(STATS_TRAINER_PREFIX)) {
            PuzzleSelectDialog trainerDialog = (PuzzleSelectDialog) mFragmentManager.findFragmentByTag(TAG_PUZZLE_DIALOG);
            if (trainerDialog != null)
                trainerDialog.dismiss();
            if (viewPager != null && viewPager.getCurrentItem() == TRAINER_PAGE) {
                // The Trainer page practises the picked set
                String name = text.substring(STATS_TRAINER_PREFIX.length());
                int colon = name.indexOf(':');
                if (colon >= 0) name = name.substring(0, colon);
                try {
                    setTrainerSubset(TrainerScrambler.TrainerSubset.valueOf(name));
                } catch (IllegalArgumentException ignored) { }
            } else {
                categoryDialogListener.onUpdateDialog(text);
            }
            return;
        }

        currentPuzzle = text;
        Prefs.edit().putString(R.string.pk_last_used_puzzle, currentPuzzle).apply();
        updateCurrentCategory();

        PuzzleSelectDialog selectDialog = (PuzzleSelectDialog) mFragmentManager.findFragmentByTag(TAG_PUZZLE_DIALOG);
        if (selectDialog != null)
            selectDialog.dismiss();

        mFragmentManager
                .beginTransaction()
                .replace(R.id.main_activity_container,
                        TimerFragmentMain.newInstance(currentPuzzle, currentPuzzleCategory, currentMbldNum, "reset", currentTimerMode, currentPuzzleSubset, currentPage), "fragment_main")
                .commit();
    }

    public int getCurrentPage() {
        return viewPager.getCurrentItem();
    }

    /** The timer mode this screen is in: {@code TIMER_MODE_TIMER} or {@code TIMER_MODE_TRAINER}. */
    public String getCurrentTimerMode() {
        return currentTimerMode;
    }

    /** The trainer subset this screen was opened with (only meaningful in trainer mode). */
    public TrainerScrambler.TrainerSubset getCurrentTrainerSubset() {
        return currentPuzzleSubset;
    }

    /**
     * Hides or restores the top and bottom bars and locks swiping and the drawer. The trainer tab
     * calls this while its own timer runs. It does what a timer start/stop does, but without the
     * broadcasts the normal timer listens to.
     */
    public void setTimingActive(boolean running) {
        if (running) {
            getMainActivity().setDrawerLock(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
            viewPager.setPagingEnabled(false);
            activateTabLayout(false);
            mToolbar.animate().translationY(-mToolbar.getHeight()).alpha(0).setDuration(mAnimationDuration);
            tabView.animate().translationY(tabView.getHeight()).alpha(0).setDuration(mAnimationDuration);
        } else {
            getMainActivity().setDrawerLock(DrawerLayout.LOCK_MODE_UNDEFINED);
            mToolbar.animate().translationY(0).alpha(1).setDuration(mAnimationDuration);
            tabView.animate().translationY(0).alpha(1).setDuration(mAnimationDuration);
            activateTabLayout(true);
            viewPager.setPagingEnabled(pagerEnabled);
        }
    }

    /** Switches this screen into trainer mode for the subset, or back to the timer when {@code subset} is null. */
    public void startTrainer(@Nullable TrainerScrambler.TrainerSubset subset) {
        if (subset == null) {
            mFragmentManager
                    .beginTransaction()
                    .replace(R.id.main_activity_container,
                            TimerFragmentMain.newInstance(PuzzleUtils.TYPE_333, "Normal", 5, "reset",
                                    TIMER_MODE_TIMER, TrainerScrambler.TrainerSubset.OLL, TIMER_PAGE), "fragment_main")
                    .commit();
        } else {
            mFragmentManager
                    .beginTransaction()
                    .replace(R.id.main_activity_container,
                            TimerFragmentMain.newInstance(subset.name(), "Normal", 5, "reset",
                                    TIMER_MODE_TRAINER, subset, TIMER_PAGE), "fragment_main")
                    .commit();
        }
    }

    protected class NavigationAdapter extends FragmentPagerAdapter {

        public NavigationAdapter(FragmentManager fm) {
            super(fm);
        }

        @NonNull
        @Override
        public Fragment getItem(int position) {
            if (DEBUG_ME) Log.d(TAG, "NavigationAdapter.createItem(" + position + ")");

            switch (position) {
                case TIMER_PAGE:
                    return TimerFragment.newInstance(
                            currentPuzzle, currentPuzzleCategory, currentMbldNum, currentScramble, currentTimerMode, currentPuzzleSubset);
                case LIST_PAGE:
                    return TimerListFragment.newInstance(
                            statsPuzzle(), statsCategory(), currentMbldNum, currentScramble, history);
                case GRAPH_PAGE:
                    return TimerGraphFragment.newInstance(
                            statsPuzzle(), statsCategory(), history);
                case TRAINER_PAGE:
                    // A second, independent timer. Same screen and settings as the Timer tab, but
                    // it trains the chosen set and saves its solves under that set's name.
                    return TimerFragment.newInstance(trainerSubset.name(), trainerCategory(),
                            currentMbldNum, "", TIMER_MODE_TRAINER, trainerSubset);
                case WCA_PAGE:
                    return com.hatopigeon.cubictimer.wca.WcaHostFragment.newInstance();
            }
            return TimerFragment.newInstance(PuzzleUtils.TYPE_333, "Normal", 5, "", TIMER_MODE_TIMER, TrainerScrambler.TrainerSubset.OLL);
        }

        @Override
        public long getItemId(int position) {
            // A different id per set makes the pager build a fresh trainer page when the set changes.
            if (position == TRAINER_PAGE) {
                return 100 + trainerSubset.ordinal() + 1000000L * (1 + (trainerCategory().hashCode() & 0xFFFF));
            }
            return position;
        }

        @Override
        public int getItemPosition(@NonNull Object object) {
            if (object instanceof TimerFragment) {
                TimerFragment f = (TimerFragment) object;
                if (f.isTrainerMode() && (f.getTrainerSubset() != trainerSubset
                        || !trainerCategory().equals(f.getTrainerCategory()))) {
                    return POSITION_NONE;
                }
            }
            // The times and graph pages are not rebuilt for another puzzle or set: they are
            // pointed at it in place, which is far quicker.
            if (object instanceof TimerListFragment) {
                ((TimerListFragment) object).rescope(statsPuzzle(), statsCategory(), currentMbldNum, currentScramble);
            }
            if (object instanceof TimerGraphFragment) {
                ((TimerGraphFragment) object).rescope(statsPuzzle(), statsCategory());
            }
            return POSITION_UNCHANGED;
        }

        @Override
        public int getCount() {
            return NUM_PAGES;
        }
    }
}
