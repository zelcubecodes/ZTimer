package com.hatopigeon.cubictimer.adapter;

import android.content.Context;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.fragment.dialog.AlgDialog;
import com.hatopigeon.cubictimer.puzzle.TrainerScrambler;
import com.hatopigeon.cubictimer.puzzle.TrainerSets;
import com.hatopigeon.cubictimer.utils.AlgUtils;
import com.hatopigeon.cubictimer.utils.ThemeUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.recyclerview.widget.RecyclerView;

/**
 * The list of cases in the "Select cases to train" sheet. Cases are laid out in sections, one per
 * group (for example "T Shapes"), the way cube.academy groups them. Each section has a header that
 * selects or deselects the whole group.
 *
 * OLL and PLL cases come from the algorithm database (they have pictures and progress). The other
 * sets are generated, so their cases are listed straight from {@link TrainerSets}.
 */
public class TrainerCursorAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    public static final int TYPE_HEADER = 0;
    public static final int TYPE_CASE = 1;

    /** One row of the list: a section header or a case. */
    private static final class Row {
        final TrainerSets.Group group; // set for headers
        final String name;             // set for cases
        final long id;                 // database id, or -1 for generated cases
        final int progress;

        Row(TrainerSets.Group group) {
            this.group = group;
            this.name = null;
            this.id = -1;
            this.progress = 0;
        }

        Row(String name, long id, int progress) {
            this.group = null;
            this.name = name;
            this.id = id;
            this.progress = progress;
        }

        boolean isHeader() {
            return group != null;
        }
    }

    /** Called when the selection changes, so the sheet can refresh anything that depends on it. */
    public interface SelectionListener {
        void onSelectionChanged();
    }

    private final Context mContext;
    private final FragmentManager fragmentManager;
    private final TrainerScrambler.TrainerSubset currentSubset;
    private final String currentPuzzleCategory;
    private final Set<String> selectedItems = new HashSet<>();
    private final List<Row> rows = new ArrayList<>();
    private final Drawable cardBackground;
    private final Drawable selectedCardBackground;
    private SelectionListener selectionListener;
    private Cursor cursor;
    private boolean dialogLocked;

    public TrainerCursorAdapter(Context context, Fragment listFragment, TrainerScrambler.TrainerSubset subset, String category) {
        this.mContext = context;
        TrainerSets.setContext(context);
        this.fragmentManager = listFragment.getFragmentManager();
        this.currentSubset = subset;
        this.currentPuzzleCategory = category;

        cardBackground = ThemeUtils.createSquareDrawable(
                mContext,
                ThemeUtils.fetchAttrColor(mContext, R.attr.colorItemListBackground),
                0, 14, 0);
        selectedCardBackground = ThemeUtils.createSquareDrawable(
                mContext,
                ThemeUtils.fetchAttrColor(mContext, R.attr.colorItemListBackgroundSelected),
                Color.BLACK, 14, 2);

        selectedItems.addAll(TrainerScrambler.fetchSelectedItems(subset, category));
        rebuildRows();
    }

    public void setSelectionListener(SelectionListener listener) {
        this.selectionListener = listener;
    }

    /** Gives the adapter the algorithm database rows (OLL and PLL). Other sets ignore it. */
    public void setCursor(Cursor cursor) {
        this.cursor = cursor;
        rebuildRows();
        notifyDataSetChanged();
    }

    private void rebuildRows() {
        rows.clear();
        boolean algBased = TrainerSets.isAlgBased(currentSubset);

        // Name -> database row, for the sets that have one.
        Map<String, long[]> db = new HashMap<>();
        if (algBased && cursor != null && !cursor.isClosed()) {
            int pos = cursor.getPosition();
            if (cursor.moveToFirst()) {
                do {
                    db.put(cursor.getString(2), new long[]{cursor.getLong(0), cursor.getInt(5)});
                } while (cursor.moveToNext());
            }
            cursor.moveToPosition(pos);
        }

        for (TrainerSets.Group group : TrainerSets.groups(currentSubset)) {
            List<Row> cases = new ArrayList<>();
            for (String name : group.cases) {
                long[] info = db.get(name);
                if (algBased && info == null) continue; // not loaded yet
                cases.add(new Row(name, info == null ? -1 : info[0], info == null ? 0 : (int) info[1]));
            }
            if (cases.isEmpty()) continue;
            // A group with a single case that has the same name (ZBLS, LSE) needs no header.
            boolean needsHeader = !(group.cases.size() == 1 && group.cases.get(0).equals(group.name));
            if (needsHeader) rows.add(new Row(group));
            rows.addAll(cases);
        }
    }

    // ------------------------------------------------------------------ selection

    private boolean isSelected(String name) {
        return selectedItems.contains(name);
    }

    private void save() {
        TrainerScrambler.saveSelectedItems(currentSubset, currentPuzzleCategory, new ArrayList<>(selectedItems));
        if (selectionListener != null) selectionListener.onSelectionChanged();
    }

    public void unselectAll() {
        selectedItems.clear();
        save();
        notifyDataSetChanged();
    }

    /** True if every one of the named cases is selected. */
    public boolean isGroupSelected(List<String> names) {
        return selectedItems.containsAll(names);
    }

    /** Selects or deselects a whole group of cases at once and saves the choice. */
    public void setGroupSelected(List<String> names, boolean selected) {
        if (selected) selectedItems.addAll(names); else selectedItems.removeAll(names);
        save();
        notifyDataSetChanged();
    }

    /** Selects every case, or clears them all if everything was already selected. */
    public void selectAll() {
        List<String> all = TrainerSets.allCases(currentSubset);
        setGroupSelected(all, !selectedItems.containsAll(all));
    }

    // ------------------------------------------------------------------ adapter

    /** True for rows that should span the whole width (the section headers). */
    public boolean isHeader(int position) {
        return rows.get(position).isHeader();
    }

    @Override
    public int getItemViewType(int position) {
        return rows.get(position).isHeader() ? TYPE_HEADER : TYPE_CASE;
    }

    @Override
    public int getItemCount() {
        return rows.size();
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_HEADER) {
            return new HeaderHolder(buildHeader(parent.getContext()));
        }
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_alg_list, parent, false);
        return new CaseHolder(v);
    }

    private static final class HeaderHolder extends RecyclerView.ViewHolder {
        final LinearLayout root;
        final TextView title;
        final TextView action;

        HeaderHolder(LinearLayout root) {
            super(root);
            this.root = root;
            this.title = (TextView) root.getChildAt(0);
            this.action = (TextView) root.getChildAt(1);
        }
    }

    private static final class CaseHolder extends RecyclerView.ViewHolder {
        final View root;
        final androidx.cardview.widget.CardView card;
        final TextView name;
        final com.hatopigeon.cubictimer.layout.Cube cube;
        final android.widget.ImageView pllArrows;
        final View progress;

        CaseHolder(View v) {
            super(v);
            root = v.findViewById(R.id.root);
            card = v.findViewById(R.id.card);
            name = v.findViewById(R.id.name);
            cube = v.findViewById(R.id.cube);
            pllArrows = v.findViewById(R.id.pll_arrows);
            progress = v.findViewById(R.id.progressBar);
        }
    }

    private LinearLayout buildHeader(Context context) {
        int pad = ThemeUtils.dpToPix(context, 8);
        int text = ThemeUtils.fetchAttrColor(context, R.attr.colorItemListText);

        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(pad * 2, pad * 2, pad * 2, pad / 2);
        row.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView title = new TextView(context);
        title.setTextColor(text);
        title.setTextSize(16);
        title.setTypeface(title.getTypeface(), Typeface.BOLD);
        title.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

        TextView action = new TextView(context);
        action.setTextColor(ThemeUtils.fetchAttrColor(context, R.attr.colorItemListText));
        action.setTextSize(12);
        action.setPadding(pad * 2, pad, pad * 2, pad);
        action.setLayoutParams(new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        row.addView(title);
        row.addView(action);
        return row;
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        Row row = rows.get(position);
        if (row.isHeader()) {
            bindHeader((HeaderHolder) holder, row.group);
        } else {
            bindCase((CaseHolder) holder, row);
        }
    }

    private void bindHeader(HeaderHolder holder, final TrainerSets.Group group) {
        int selected = 0;
        for (String c : group.cases) if (selectedItems.contains(c)) selected++;
        boolean full = selected == group.cases.size();
        holder.title.setText(group.name + "  (" + selected + "/" + group.cases.size() + ")");
        holder.action.setText(full ? R.string.trainer_group_deselect : R.string.trainer_group_select);
        holder.action.setBackground(full ? selectedCardBackground : cardBackground);
        View.OnClickListener toggle = v -> setGroupSelected(group.cases, !isGroupSelected(group.cases));
        holder.action.setOnClickListener(toggle);
        holder.root.setOnClickListener(toggle);
    }

    private void bindCase(final CaseHolder holder, final Row row) {
        holder.name.setText(row.name);
        holder.card.setBackground(isSelected(row.name) ? selectedCardBackground : cardBackground);

        // Picture: the case itself for OLL and PLL, the matching OLL for corner types, else none.
        String state = null;
        holder.pllArrows.setVisibility(View.GONE);
        try {
            if (TrainerSets.isAlgBased(currentSubset)) {
                state = AlgUtils.getCaseState(mContext, currentSubset.name(), row.name);
            } else {
                state = TrainerSets.pictureFor(currentSubset, row.name);
            }
        } catch (Exception ignored) {
        }
        if (state != null) {
            holder.cube.setVisibility(View.VISIBLE);
            holder.cube.setCubeState(state);
        } else {
            holder.cube.setVisibility(View.INVISIBLE);
        }
        // Sets without a letter picture (ZBLS, EOLS, WVLS, VLS) get csTimer's own drawing of the case
        if (state == null) {
            try {
                String svg = TrainerSets.svgFor(currentSubset, row.name);
                if (svg != null) {
                    holder.pllArrows.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
                    holder.pllArrows.setImageDrawable(new android.graphics.drawable.PictureDrawable(
                            com.caverock.androidsvg.SVG.getFromString(svg).renderToPicture()));
                    holder.pllArrows.setVisibility(View.VISIBLE);
                }
            } catch (Exception ignored) {
            }
        }
        if (currentSubset == TrainerScrambler.TrainerSubset.PLL) {
            holder.pllArrows.setImageDrawable(AlgUtils.getPllArrow(mContext, row.name));
            holder.pllArrows.setVisibility(View.VISIBLE);
        }
        holder.progress.setVisibility(row.id >= 0 ? View.VISIBLE : View.INVISIBLE);

        holder.root.setOnClickListener(v -> {
            if (isSelected(row.name)) selectedItems.remove(row.name); else selectedItems.add(row.name);
            holder.card.setBackground(isSelected(row.name) ? selectedCardBackground : cardBackground);
            save();
            // Headers show how many cases of their group are chosen.
            notifyDataSetChanged();
        });

        holder.root.setOnLongClickListener(v -> {
            if (row.id >= 0 && !dialogLocked && fragmentManager != null) {
                dialogLocked = true;
                AlgDialog algDialog = AlgDialog.newInstance(row.id);
                algDialog.show(fragmentManager, "alg_dialog");
                algDialog.setDialogListener(new com.hatopigeon.cubictimer.listener.DialogListener() {
                    @Override
                    public void onUpdateDialog() {
                    }

                    @Override
                    public void onDismissDialog() {
                        dialogLocked = false;
                    }
                });
            }
            return true;
        });
    }
}
