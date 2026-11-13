package com.hatopigeon.cubictimer.fragment.dialog;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.StringRes;
import androidx.fragment.app.DialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;

import com.google.android.material.tabs.TabLayout;
import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.CubicTimer;
import com.hatopigeon.cubictimer.database.DatabaseHandler;
import com.hatopigeon.cubictimer.items.Solve;
import com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset;
import com.hatopigeon.cubictimer.puzzle.TrainerSets;
import com.hatopigeon.cubictimer.utils.CsPuzzles;
import com.hatopigeon.cubictimer.utils.PuzzleUtils;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

/**
 * <p>
 * A dialog fragment that chooses a puzzle type and category, or a trainer set and group. Once the
 * desired options are chosen this dialog relays the selection through the parent activity to the
 * "consumer" fragment that initiated this fragment. The "consumer" fragment is identified by its
 * fragment tag, which it passes to this chooser in {@link #newInstance(int, String)} and which this
 * chooser passes back to the activity, so the activity can find that "consumer" fragment.
 * </p>
 * <p>
 * The dialog has two tabs. "Puzzles" lists the WCA puzzles followed by the Non-WCA puzzles; its
 * category list holds the categories of the chosen puzzle. "Trainer" lists the trainer sets; its
 * group list holds the groups of the chosen set. Trainer solves are stored with the name of the set
 * as the puzzle type and the group as the category, so both tabs answer the same way. When
 * exporting, the trainer group list starts with "All groups" (the {@link DatabaseHandler#SUBTYPE_ALL}
 * wildcard) so a whole set can be exported at once.
 * </p>
 * <p>
 * <i>This dialog fragment <b>must</b> be used in the context of an activity that implements the
 * {@link PuzzleCallback} interface, or exceptions will occur.</i>
 * </p>
 */
public class PuzzleChooserDialog extends DialogFragment {
    /**
     * An interface that allows fragments to communicate changes to the selected puzzle type and/or
     * category.
     */
    public interface PuzzleCallback {
        /**
         * Notifies the listener that a new puzzle type and/or category have been selected.
         *
         * @param tag
         *     The tag identifying the callback. When this interface is implemented by an activity
         *     as a means of communication between two fragments, the tag should be the fragment
         *     tag that identifies the fragment to which the activity should relay the message. The
         *     receiving fragment should also (probably) implement this interface.
         * @param puzzleType
         *     The name of the newly-selected puzzle type (or trainer set).
         * @param puzzleCategory
         *     The name of the newly-selected puzzle category (or trainer group).
         */
        void onPuzzleSelected(
                @NonNull String tag, @NonNull String puzzleType, @NonNull String puzzleCategory);
    }

    private Unbinder mUnbinder;

    @BindView(R.id.chooserTabs)          TabLayout tabs;
    @BindView(R.id.puzzleSection)        View     puzzleSection;
    @BindView(R.id.trainerSection)       View     trainerSection;
    @BindView(R.id.puzzleSpinner)        Spinner  puzzleSpinner;
    @BindView(R.id.categorySpinner)      Spinner  categorySpinner;
    @BindView(R.id.trainerSetSpinner)    Spinner  trainerSetSpinner;
    @BindView(R.id.trainerGroupSpinner)  Spinner  trainerGroupSpinner;
    @BindView(R.id.selectButton)         TextView selectButton;

    private static final String CURRENT_CATEGORY = "Normal";

    /** The tab that was open last time (0 = Puzzles, 1 = Trainer). */
    private static int lastTab = 0;

    /**
     * The name of the fragment argument holding a string resource ID for the text to be displayed
     * on the selection button that closes this chooser dialog.
     */
    private static final String ARG_BUTTON_TEXT_RES_ID = "buttonTextResourceID";

    /**
     * The name of the fragment argument holding the fragment tag of the fragment that instantiated
     * this puzzle chooser.
     */
    private static final String ARG_CONSUMER_TAG = "consumerTag";

    /** True when the button says "Export": the trainer groups then offer "All groups". */
    private boolean mIsExport;

    /** The puzzle types behind the entries of the puzzle spinner (WCA first, then Non-WCA). */
    private final List<String> mPuzzleTypes = new ArrayList<>();

    /** The trainer sets behind the entries of the trainer set spinner. */
    private final List<TrainerSubset> mTrainerSets = new ArrayList<>();

    /** The values behind the entries of the trainer group spinner ("*" means all groups). */
    private final List<String> mGroupValues = new ArrayList<>();

    private String mSelectedPuzzleType;
    private String mSelectedPuzzleCategory;
    private TrainerSubset mSelectedSet;
    private String mSelectedGroup;

    private ArrayAdapter<String> categoryAdapter;

    /**
     * Creates a new instance of this fragment.
     *
     * @param buttonTextResID
     *     The string resource ID of the string to be displayed on the select button that closes
     *     this fragment and reports the selection. If zero, the default "OK" will be shown.
     * @param consumerTag
     *     The fragment tag that identifies the fragment that instantiated this puzzle chooser.
     *     This "consumer" fragment will be informed, via the parent activity, of the selected
     *     puzzle type and category before this chooser is dismissed.
     *
     * @return
     *     The new instance of this puzzle chooser.
     */
    public static PuzzleChooserDialog newInstance(
            @StringRes int buttonTextResID, String consumerTag) {
        final PuzzleChooserDialog fragment = new PuzzleChooserDialog();
        final Bundle args = new Bundle();

        args.putInt(ARG_BUTTON_TEXT_RES_ID, buttonTextResID);
        args.putString(ARG_CONSUMER_TAG, consumerTag);
        fragment.setArguments(args);

        return fragment;
    }

    @Override
    public View onCreateView(
            LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        final View dialogView = inflater.inflate(R.layout.dialog_puzzle_chooser_dialog, container);
        mUnbinder = ButterKnife.bind(this, dialogView);

        final @StringRes int buttonTextResID
                = getArguments() != null ? getArguments().getInt(ARG_BUTTON_TEXT_RES_ID, 0) : 0;

        if (buttonTextResID != 0) {
            // Override the default text.
            selectButton.setText(buttonTextResID);
        }
        mIsExport = buttonTextResID == R.string.action_export;

        setUpPuzzleTab();
        setUpTrainerTab();
        setUpTabs();

        selectButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Relay this information back to the fragment/activity that opened this chooser.
                final String tag = getArguments().getString(ARG_CONSUMER_TAG, "not set!");
                if (tabs.getSelectedTabPosition() == 1) {
                    getRelayActivity().onPuzzleSelected(tag, mSelectedSet.name(), mSelectedGroup);
                } else {
                    getRelayActivity().onPuzzleSelected(
                            tag, mSelectedPuzzleType, mSelectedPuzzleCategory);
                }
                dismiss();
            }
        });

        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        getDialog().getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        return dialogView;
    }

    // ---- Puzzles tab: the WCA puzzles, then the Non-WCA ones ----

    private void setUpPuzzleTab() {
        final List<String> names = new ArrayList<>();

        final String[] wcaNames = getResources().getStringArray(R.array.puzzles);
        for (int i = 0; i < wcaNames.length; i++) {
            names.add(wcaNames[i]);
            mPuzzleTypes.add(PuzzleUtils.getPuzzleInPosition(i));
        }
        for (CsPuzzles.Entry entry : CsPuzzles.all()) {
            names.add(entry.name);
            mPuzzleTypes.add(entry.type);
        }

        puzzleSpinner.setAdapter(new ArrayAdapter<>(
                getContext(), android.R.layout.simple_spinner_dropdown_item, names));

        mSelectedPuzzleType = mPuzzleTypes.get(0);
        mSelectedPuzzleCategory = CURRENT_CATEGORY;
        updateCategoriesForType(mSelectedPuzzleType);

        puzzleSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                mSelectedPuzzleType = mPuzzleTypes.get(i);
                updateCategoriesForType(mSelectedPuzzleType);
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });

        categorySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                mSelectedPuzzleCategory = categoryAdapter.getItem(i);
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });
    }

    private void updateCategoriesForType(String puzzleType) {
        final DatabaseHandler dbHandler = CubicTimer.getDBHandler();
        final List<String> subtypeList = dbHandler.getAllSubtypesFromType(puzzleType);

        if (subtypeList.size() == 0) {
            subtypeList.add(CURRENT_CATEGORY);
            if (!mIsExport) {
                // An import needs the category to exist, so it can be picked afterwards.
                dbHandler.addSolve(new Solve(1, puzzleType, CURRENT_CATEGORY,
                        0L, "", PuzzleUtils.PENALTY_HIDETIME, "", true));
            }
        }
        categoryAdapter = new ArrayAdapter<>(
                getContext(), android.R.layout.simple_spinner_dropdown_item, subtypeList);
        categorySpinner.setAdapter(categoryAdapter);
        mSelectedPuzzleCategory = subtypeList.get(0);
    }

    // ---- Trainer tab: the trainer sets and their groups ----

    private void setUpTrainerTab() {
        // Every set of the trainer's set picker, family by family.
        final Set<TrainerSubset> sets = new LinkedHashSet<>();
        for (int f = 0; f < TrainerSets.FAMILIES.length; f++) {
            sets.addAll(TrainerSets.setsInFamily(f));
        }
        // Any other set that still holds solves must stay exportable.
        final DatabaseHandler dbHandler = CubicTimer.getDBHandler();
        for (TrainerSubset set : TrainerSubset.values()) {
            if (!sets.contains(set) && !dbHandler.getAllSubtypesFromType(set.name()).isEmpty()) {
                sets.add(set);
            }
        }
        mTrainerSets.addAll(sets);

        final List<String> names = new ArrayList<>();
        for (TrainerSubset set : mTrainerSets) {
            names.add(TrainerSets.familyOf(set) + " \u00b7 " + TrainerSets.displayName(set));
        }
        trainerSetSpinner.setAdapter(new ArrayAdapter<>(
                getContext(), android.R.layout.simple_spinner_dropdown_item, names));

        mSelectedSet = mTrainerSets.get(0);
        updateGroupsForSet(mSelectedSet);

        trainerSetSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                mSelectedSet = mTrainerSets.get(i);
                updateGroupsForSet(mSelectedSet);
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });

        trainerGroupSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                mSelectedGroup = mGroupValues.get(i);
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });
    }

    private void updateGroupsForSet(TrainerSubset set) {
        final List<String> labels = new ArrayList<>();
        mGroupValues.clear();

        if (mIsExport) {
            // Export a whole set at once, or one group of it.
            mGroupValues.add(DatabaseHandler.SUBTYPE_ALL);
            labels.add(getString(R.string.exim_all_groups));
        }

        final Set<String> groups = new LinkedHashSet<>();
        if (!mIsExport) {
            // An import needs one real group, so offer the set's own groups as well.
            try {
                TrainerSets.setContext(getContext());
                groups.addAll(TrainerSets.groupNames(set));
            } catch (RuntimeException ignored) {
                // Fall back to the groups that already hold solves.
            }
        }
        groups.addAll(CubicTimer.getDBHandler().getAllSubtypesFromType(set.name()));
        if (!mIsExport && groups.isEmpty()) {
            groups.add(CURRENT_CATEGORY);
        }
        for (String group : groups) {
            mGroupValues.add(group);
            labels.add(group);
        }

        trainerGroupSpinner.setAdapter(new ArrayAdapter<>(
                getContext(), android.R.layout.simple_spinner_dropdown_item, labels));
        mSelectedGroup = mGroupValues.get(0);
    }

    // ---- Tabs ----

    private void setUpTabs() {
        tabs.addTab(tabs.newTab().setText(R.string.exim_tab_puzzles), lastTab == 0);
        tabs.addTab(tabs.newTab().setText(R.string.drawer_title_trainer), lastTab == 1);
        showTab(lastTab);

        tabs.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                lastTab = tab.getPosition();
                showTab(lastTab);
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
            }
        });
    }

    private void showTab(int position) {
        puzzleSection.setVisibility(position == 0 ? View.VISIBLE : View.GONE);
        trainerSection.setVisibility(position == 1 ? View.VISIBLE : View.GONE);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        mUnbinder.unbind();
    }

    /**
     * Gets the activity reference type cast to support the required interface for relaying the
     * puzzle type/category selection to another fragment.
     *
     * @return The attached activity, or {@code null} if no activity is attached.
     */
    private <A extends PuzzleCallback> A getRelayActivity() {
        //noinspection unchecked
        return (A) getActivity();
    }
}
