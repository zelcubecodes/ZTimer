package com.hatopigeon.cubictimer.wca;

import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.viewpager.widget.ViewPager;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.fragment.TimerFragmentMain;

/**
 * The single WCA tab. A small switch at the top flips between WCA Results and WCA Live.
 * Both are normal fragments living in a child fragment manager, so each one keeps its own state
 * while the other is showing.
 */
public class WcaHostFragment extends Fragment {
    public static final int SUB_RESULTS = 0;
    public static final int SUB_LIVE = 1;

    private static final String KEY_SUB = "wca_sub";
    private static final String TAG_RESULTS = "wca_sub_results";
    private static final String TAG_LIVE = "wca_sub_live";

    /** Space under the top bar taken by the switch, so the children start below it. */
    private static final int SWITCH_HEIGHT_DP = 44;
    private static final int CHILD_TOP_PAD_DP = 80 + SWITCH_HEIGHT_DP;

    private WcaUi ui;
    private TextView pillResults;
    private TextView pillLive;
    private int sub = SUB_RESULTS;

    public static WcaHostFragment newInstance() {
        return new WcaHostFragment();
    }

    /**
     * Brings the WCA tab to the front and shows the given sub page. Called by the Results and Live
     * pages when they hand over to each other, for example "open this competition in Live".
     */
    public static void open(@NonNull Fragment from, int subPage) {
        View pager = from.requireActivity().findViewById(R.id.pager);
        if (pager instanceof ViewPager) {
            ((ViewPager) pager).setCurrentItem(TimerFragmentMain.WCA_PAGE, true);
        }

        Fragment p = from.getParentFragment();
        if (p instanceof WcaHostFragment) {
            ((WcaHostFragment) p).select(subPage);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull android.view.LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        ui = new WcaUi(requireContext());
        if (savedInstanceState != null) sub = savedInstanceState.getInt(KEY_SUB, SUB_RESULTS);

        FrameLayout root = new FrameLayout(requireContext());
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        FrameLayout content = new FrameLayout(requireContext());
        content.setId(R.id.wca_host_content);
        root.addView(content, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        // Switch, sitting just below the top bar
        LinearLayout bar = new LinearLayout(requireContext());
        bar.setOrientation(LinearLayout.HORIZONTAL);
        bar.setGravity(Gravity.CENTER);
        pillResults = ui.pill("Results", sub == SUB_RESULTS);
        pillLive = ui.pill("Live", sub == SUB_LIVE);
        pillResults.setOnClickListener(v -> select(SUB_RESULTS));
        pillLive.setOnClickListener(v -> select(SUB_LIVE));
        bar.addView(pillResults, ui.lp(ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, 0, 0, 8, 0));
        bar.addView(pillLive);

        FrameLayout.LayoutParams barLp = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ui.dp(SWITCH_HEIGHT_DP), Gravity.TOP);
        barLp.topMargin = ui.dp(80 - 4);
        root.addView(bar, barLp);
        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        FragmentManager fm = getChildFragmentManager();
        Fragment results = fm.findFragmentByTag(TAG_RESULTS);
        Fragment live = fm.findFragmentByTag(TAG_LIVE);

        FragmentTransaction tx = fm.beginTransaction();
        if (results == null) {
            results = WcaResultsFragment.newInstance();
            results.setArguments(topPadArgs());
            results.setUserVisibleHint(false);
            tx.add(R.id.wca_host_content, results, TAG_RESULTS);
        }
        if (live == null) {
            live = WcaLiveFragment.newInstance();
            live.setArguments(topPadArgs());
            live.setUserVisibleHint(false);
            tx.add(R.id.wca_host_content, live, TAG_LIVE);
        }
        tx.commitNowAllowingStateLoss();
        applySub(false);
    }

    private Bundle topPadArgs() {
        Bundle b = new Bundle();
        b.putInt(WcaResultsFragment.ARG_TOP_PAD_DP, CHILD_TOP_PAD_DP);
        return b;
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt(KEY_SUB, sub);
    }

    /** Switches between Results and Live. */
    public void select(int subPage) {
        if (subPage == sub) return;
        sub = subPage;
        applySub(true);
    }

    private void applySub(boolean fromUser) {
        FragmentManager fm = getChildFragmentManager();
        Fragment results = fm.findFragmentByTag(TAG_RESULTS);
        Fragment live = fm.findFragmentByTag(TAG_LIVE);
        if (results == null || live == null) return;

        boolean pageVisible = getUserVisibleHint();
        View rv = results.getView();
        View lv = live.getView();
        if (rv != null) rv.setVisibility(sub == SUB_RESULTS ? View.VISIBLE : View.GONE);
        if (lv != null) lv.setVisibility(sub == SUB_LIVE ? View.VISIBLE : View.GONE);

        if (pillResults != null) ui.stylePill(pillResults, sub == SUB_RESULTS);
        if (pillLive != null) ui.stylePill(pillLive, sub == SUB_LIVE);

        // The two pages use "visible to user" to start and stop refreshing and to pick up
        // hand-over requests, so tell them which one is showing.
        results.setUserVisibleHint(pageVisible && sub == SUB_RESULTS);
        live.setUserVisibleHint(pageVisible && sub == SUB_LIVE);
    }

    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isAdded() || getView() == null) return;
        Fragment results = getChildFragmentManager().findFragmentByTag(TAG_RESULTS);
        Fragment live = getChildFragmentManager().findFragmentByTag(TAG_LIVE);
        if (results != null) results.setUserVisibleHint(isVisibleToUser && sub == SUB_RESULTS);
        if (live != null) live.setUserVisibleHint(isVisibleToUser && sub == SUB_LIVE);
    }
}
