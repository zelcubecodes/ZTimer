package com.hatopigeon.cubictimer.adapter;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.widget.ImageView;
import androidx.vectordrawable.graphics.drawable.VectorDrawableCompat;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * The practice sets sorted into their families (Last Layer, ZB, COLLs, ...). Family names are
 * headers that cannot be tapped; the sets under them can.
 */
public class TrainerSetListAdapter extends BaseAdapter {

    private static final int TYPE_HEADER = 0;
    private static final int TYPE_SET = 1;
    private static final int TYPE_CATEGORY = 2;

    private static final String PREF_STARRED = "trainer_starred_sets";

    private final Context context;
    private final TrainerSubset current;
    private final List<String> categories;
    private final String currentCategory;
    private final List<String> headers = new ArrayList<>();      // text of a header row, or null
    private final List<TrainerSubset> sets = new ArrayList<>();  // the set of a set row, or null
    private final List<String> cats = new ArrayList<>();         // the category of a category row, or null

    /** Only the trainer sets. */
    public TrainerSetListAdapter(Context context, TrainerSubset current) {
        this(context, current, null, null);
    }

    /**
     * @param current         the set to show in bold, or null
     * @param categories      normal categories to list first, or null for none
     * @param currentCategory the category to show in bold, or null
     */
    public TrainerSetListAdapter(Context context, TrainerSubset current, List<String> categories, String currentCategory) {
        this.context = context;
        this.current = current;
        this.categories = categories;
        this.currentCategory = currentCategory;
        rebuild();
    }

    private static Set<String> readStarred(Context context) {
        return new HashSet<>(PreferenceManager.getDefaultSharedPreferences(context)
                .getStringSet(PREF_STARRED, new HashSet<String>()));
    }

    private void toggleStar(TrainerSubset set) {
        Set<String> starred = readStarred(context);
        if (!starred.remove(set.name())) starred.add(set.name());
        SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(context).edit();
        editor.putStringSet(PREF_STARRED, starred).apply();
        rebuild();
        notifyDataSetChanged();
    }

    private void addRow(String header, TrainerSubset set, String category) {
        headers.add(header);
        sets.add(set);
        cats.add(category);
    }

    /** Lays the rows out again: categories, then starred sets, then the families. */
    private void rebuild() {
        headers.clear();
        sets.clear();
        cats.clear();
        if (categories != null) {
            for (String c : categories) addRow(null, null, c);
        }
        Set<String> starred = readStarred(context);
        List<TrainerSubset> top = new ArrayList<>();
        for (int f = 0; f < TrainerSets.FAMILIES.length; f++) {
            for (TrainerSubset t : TrainerSets.setsInFamily(f)) {
                if (starred.contains(t.name())) top.add(t);
            }
        }
        if (!top.isEmpty()) {
            addRow(context.getString(R.string.trainer_starred_header), null, null);
            for (TrainerSubset t : top) addRow(null, t, null);
        }
        for (int f = 0; f < TrainerSets.FAMILIES.length; f++) {
            List<TrainerSubset> inFamily = new ArrayList<>();
            for (TrainerSubset t : TrainerSets.setsInFamily(f)) {
                if (!starred.contains(t.name())) inFamily.add(t);
            }
            if (inFamily.isEmpty()) continue;
            addRow(TrainerSets.FAMILIES[f], null, null);
            for (TrainerSubset t : inFamily) addRow(null, t, null);
        }
    }

    /** The set in a row, or null if the row is not a set. */
    public TrainerSubset setAt(int position) {
        return sets.get(position);
    }

    /** The category in a row, or null if the row is not a category. */
    public String categoryAt(int position) {
        return cats.get(position);
    }

    @Override
    public int getCount() {
        return sets.size();
    }

    @Override
    public Object getItem(int position) {
        return sets.get(position) != null ? sets.get(position) : cats.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public int getViewTypeCount() {
        return 3;
    }

    @Override
    public int getItemViewType(int position) {
        if (sets.get(position) != null) return TYPE_SET;
        if (cats.get(position) != null) return TYPE_CATEGORY;
        return TYPE_HEADER;
    }

    @Override
    public boolean isEnabled(int position) {
        return getItemViewType(position) != TYPE_HEADER;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        int type = getItemViewType(position);
        if (type == TYPE_HEADER) {
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
        if (type == TYPE_CATEGORY) {
            TextView row = convertView instanceof TextView ? (TextView) convertView
                    : (TextView) LayoutInflater.from(context).inflate(R.layout.item_bottom_spinner, parent, false);
            String name = cats.get(position);
            row.setText(name);
            row.setTypeface(null, name.equals(currentCategory) ? Typeface.BOLD : Typeface.NORMAL);
            VectorDrawableCompat icon = VectorDrawableCompat.create(context.getResources(), R.drawable.ic_label, null);
            if (icon != null) icon.setAlpha(90);
            row.setCompoundDrawablesWithIntrinsicBounds(icon, null, null, null);
            return row;
        }
        final TrainerSubset set = sets.get(position);
        View view = convertView != null && convertView.findViewById(R.id.item) != null
                ? convertView
                : LayoutInflater.from(context).inflate(R.layout.item_trainer_set, parent, false);
        TextView title = view.findViewById(R.id.item);
        title.setText(TrainerSets.displayName(set));
        title.setTypeface(null, set == current ? Typeface.BOLD : Typeface.NORMAL);
        // The set that is open gets a soft pill behind it
        title.setBackgroundResource(R.drawable.trainer_set_item_background);
        if (set == current) {
            android.graphics.drawable.GradientDrawable pill = new android.graphics.drawable.GradientDrawable();
            pill.setColor(0x1F2962FF);
            pill.setCornerRadius(ThemeUtils.dpToPix(context, 12)); // same as the row ripple: 20 card - 8 inset
            title.setBackground(new android.graphics.drawable.LayerDrawable(new android.graphics.drawable.Drawable[]{
                    pill, context.getResources().getDrawable(R.drawable.trainer_set_item_background)}));
        }
        ImageView star = view.findViewById(R.id.star);
        boolean isStarred = readStarred(context).contains(set.name());
        star.setImageResource(isStarred ? R.drawable.ic_wca_star_filled : R.drawable.ic_wca_star_outline);
        star.setColorFilter(isStarred ? 0xFFFFC107 : ThemeUtils.fetchAttrColor(context, R.attr.colorItemListText));
        star.setAlpha(isStarred ? 1f : 0.6f);
        star.setOnClickListener(v -> {
            // The star springs up first, so you see what you did, then the list reorders
            v.animate().scaleX(1.4f).scaleY(1.4f).setDuration(110).withEndAction(() ->
                    v.animate().scaleX(1f).scaleY(1f).setDuration(130).withEndAction(() -> toggleStar(set)).start()).start();
        });
        return view;
    }
}
