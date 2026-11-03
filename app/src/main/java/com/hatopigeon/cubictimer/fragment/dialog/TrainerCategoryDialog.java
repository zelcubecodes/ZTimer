package com.hatopigeon.cubictimer.fragment.dialog;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.view.menu.MenuBuilder;
import androidx.appcompat.view.menu.MenuPopupHelper;
import androidx.fragment.app.DialogFragment;

import com.afollestad.materialdialogs.MaterialDialog;
import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.adapter.BottomSheetSpinnerAdapter;
import com.hatopigeon.cubictimer.utils.ThemeUtils;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

/**
 * The category popup of the Trainer page. It looks and works like the one of the Timer: a list of
 * categories, a "New" button, and a long press on an entry to rename or remove it. A trainer
 * category is its own selection of cases for the open set.
 */
public class TrainerCategoryDialog extends DialogFragment {

    /** What the dialog needs from the screen that opens it. */
    public interface Host {
        List<String> categories();

        void onAdd(String name);

        void onSelect(String name);

        void onRename(String oldName, String newName);

        void onRemove(String name);
    }

    @BindView(R.id.add_category) View addCategoryButton;
    @BindView(R.id.list) ListView listView;
    @BindView(R.id.category_tabs) View tabs;

    private Unbinder unbinder;
    private Host host;
    private Context mContext;

    public static TrainerCategoryDialog newInstance() {
        return new TrainerCategoryDialog();
    }

    public void setHost(Host host) {
        this.host = host;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.dialog_category_select, container, false);
        unbinder = ButterKnife.bind(this, view);
        mContext = getContext();
        getDialog().getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        return view;
    }

    @SuppressWarnings("RestrictedApi")
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        if (host == null) { // the screen was recreated, nothing to show
            dismiss();
            return;
        }
        tabs.setVisibility(View.GONE);
        updateList();

        listView.setOnItemClickListener((parent, v, position, id) -> {
            host.onSelect(host.categories().get(position));
            dismiss();
        });

        listView.setOnItemLongClickListener((parent, v, position, id) -> {
            final List<String> categories = host.categories();
            if (position >= categories.size()) return true;
            final String name = categories.get(position);
            if (position == 0) return true; // the first category always stays

            MenuBuilder menuBuilder = new MenuBuilder(mContext);
            new MenuInflater(mContext).inflate(R.menu.menu_category_options, menuBuilder);
            MenuPopupHelper popupHelper = new MenuPopupHelper(mContext, menuBuilder, v);
            popupHelper.setForceShowIcon(true);
            menuBuilder.setCallback(new MenuBuilder.Callback() {
                @Override
                public boolean onMenuItemSelected(MenuBuilder menu, MenuItem item) {
                    if (item.getItemId() == R.id.rename) {
                        ThemeUtils.roundAndShowDialog(mContext, new MaterialDialog.Builder(mContext)
                                .title(R.string.enter_new_name_dialog)
                                .input("", name, false, (dialog, input) -> {
                                    host.onRename(name, input.toString().trim());
                                    updateList();
                                })
                                .inputRange(2, 32)
                                .positiveText(R.string.action_done)
                                .negativeText(R.string.action_cancel)
                                .build());
                    } else if (item.getItemId() == R.id.remove) {
                        ThemeUtils.roundAndShowDialog(mContext, new MaterialDialog.Builder(mContext)
                                .title(R.string.remove_subtype_confirmation)
                                .content(getString(R.string.remove_subtype_confirmation_content) + " \"" + name + "\"?")
                                .positiveText(R.string.action_remove)
                                .negativeText(R.string.action_cancel)
                                .onPositive((dialog, which) -> {
                                    host.onRemove(name);
                                    updateList();
                                })
                                .build());
                    }
                    return false;
                }

                @Override
                public void onMenuModeChange(MenuBuilder menu) {
                }
            });
            popupHelper.show();
            return true;
        });

        addCategoryButton.setOnClickListener(v -> ThemeUtils.roundAndShowDialog(mContext, new MaterialDialog.Builder(mContext)
                .title(R.string.enter_type_name)
                .inputRange(2, 32)
                .input(R.string.enter_type_name, 0, false, (dialog, input) -> {
                    host.onAdd(input.toString().trim());
                    dismiss();
                })
                .build()));
    }

    private void updateList() {
        if (host == null || listView == null) return;
        listView.setAdapter(new BottomSheetSpinnerAdapter(mContext, host.categories().toArray(new String[0]), new int[]{}));
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (unbinder != null) unbinder.unbind();
    }
}
