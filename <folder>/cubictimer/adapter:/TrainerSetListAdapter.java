package com.hatopigeon.cubictimer.adapter;

import android.content.Context;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.puzzle.TrainerScrambler.TrainerSubset;
import com.hatopigeon.cubictimer.puzzle.TrainerSets;
import com.hatopigeon.cubictimer.utils.ThemeUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * The practice sets sorted into their families (Last Layer, ZB, COLLs, ...). Family names are
 * headers that cannot be tapped; the sets under them can.
 */
public class TrainerSetListAdapter extends BaseAdapter {

    private static final int TYPE_HEADER = 0;
    private static final int TYPE_SET = 1;

    private final Context context;
    private final TrainerSubset current;
    private final List<String> headers = new ArrayList<>();      // text of a header row, or null
    private final List<TrainerSubset> sets = new ArrayList<>();  // the set of a set row, or null

    private static final String PREF_FAVORITES = "ztimer_trainer_favorites";

    /** The sets the user starred, by name. */
    public static java.util.Set<String> favorites(Context context) {
        return new java.util.HashSet<>(android.preference.PreferenceManager.getDefaultSharedPreferences(context)
                .getStringSet(PREF_FAVORITES, new java.util.HashSet<String>()));
    }

    /** @param current the set to show in bold, or null */
    public TrainerSetListAdapter(Context context, TrainerSubset current) {
        this.context = context;
        this.current = current;
        rebuild();
    }

    /** Starred sets first, then the families. */
    private void rebuild() {
        headers.clear();
        sets.clear();
        java.util.Set<String> starred = favorites(context);
        boolean any = false;
        for (int f = 0; f < TrainerSets.FAMILIES.length; f++) {
            for (TrainerSubset t : TrainerSets.setsInFamily(f)) {
                if (!starred.contains(t.name())) continue;
                if (!any) {
                    headers.add(context.getString(R.string.trainer_starred_header));
                    sets.add(null);
                    any = true;
                }
                headers.add(null);
                sets.add(t);
            }
        }
        for (int f = 0; f < TrainerSets.FAMILIES.length; f++) {
            headers.add(TrainerSets.FAMILIES[f]);
            sets.add(null);
            for (TrainerSubset t : TrainerSets.setsInFamily(f)) {
                headers.add(null);
                sets.add(t);
            }
        }
    }

    private void toggleStar(TrainerSubset set) {
        java.util.Set<String> starred = favorites(context);
        if (!starred.remove(set.name())) starred.add(set.name());
        android.preference.PreferenceManager.getDefaultSharedPreferences(context).edit()
                .putStringSet(PREF_FAVORITES, starred).apply();
        rebuild();
        notifyDataSetChanged();
    }

    /** The set in a row, or null if the row is a family header. */
    public TrainerSubset setAt(int position) {
        return sets.get(position);
    }

    @Override
    public int getCount() {
        return sets.size();
    }

    @Override
    public Object getItem(int position) {
        return sets.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public int getViewTypeCount() {
        return 2;
    }

    @Override
    public int getItemViewType(int position) {
        return sets.get(position) == null ? TYPE_HEADER : TYPE_SET;
    }

    @Override
    public boolean isEnabled(int position) {
        return sets.get(position) != null;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        TrainerSubset set = sets.get(position);
        if (set == null) {
            TextView header = convertView instanceof TextView ? (TextView) convertView : new TextView(context);
            int pad = ThemeUtils.dpToPix(context, 8);
            header.setPadding(pad * 3, pad * 2, pad * 2, pad / 2);
            header.setTextSize(12);
            header.setLetterSpacing(0.08f);
            header.setAllCaps(true);
            header.setTypeface(null, Typeface.BOLD);
            header.setTextColor(ThemeUtils.fetchAttrColor(context, R.attr.colorItemListText));
            header.setAlpha(0.7f);
            header.setText(headers.get(position));
            return header;
        }
        View view = convertView != null && convertView.findViewById(R.id.item) != null
                ? convertView
                : LayoutInflater.from(context).inflate(R.layout.item_trainer_set, parent, false);
        TextView title = view.findViewById(R.id.item);
        title.setText(TrainerSets.displayName(set));
        title.setTypeface(null, set == current ? Typeface.BOLD : Typeface.NORMAL);
        android.widget.ImageView star = view.findViewById(R.id.star);
        boolean isStarred = favorites(context).contains(set.name());
        star.setImageResource(isStarred ? R.drawable.ic_wca_star_filled : R.drawable.ic_wca_star_outline);
        star.setColorFilter(isStarred ? 0xFFFFB300 : ThemeUtils.fetchAttrColor(context, R.attr.colorItemListText));
        star.setOnClickListener(v -> toggleStar(set));
        // The set that is open gets a soft pill behind it
        title.setBackgroundResource(R.drawable.trainer_set_item_background);
        if (set == current) {
            android.graphics.drawable.GradientDrawable pill = new android.graphics.drawable.GradientDrawable();
            pill.setColor(0x1F2962FF);
            pill.setCornerRadius(ThemeUtils.dpToPix(context, 16));
            title.setBackground(new android.graphics.drawable.LayerDrawable(new android.graphics.drawable.Drawable[]{
                    pill, context.getResources().getDrawable(R.drawable.trainer_set_item_background)}));
        }
        return view;
    }
}
