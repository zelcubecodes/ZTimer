package com.hatopigeon.cubictimer.sync;

import android.app.Activity;
import android.app.Dialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.wca.WcaUi;

import java.text.DateFormat;
import java.util.Date;

/**
 * The Sync screen: create or enter a sync code, pick a nickname, sync now.
 * Built from the same design tokens as the rest of the app (see {@link WcaUi}): 20dp pop-up corners,
 * inner shapes that are concentric with the outside, accent blue, pill buttons, and small animations
 * that confirm what just happened.
 */
public final class SyncDialog {
    private SyncDialog() {
    }

    public static void show(final Activity activity) {
        final WcaUi ui = new WcaUi(activity);
        final LinearLayout root = new LinearLayout(activity);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(ui.dp(4), ui.dp(4), ui.dp(4), ui.dp(2));
        final ScrollView sv = new ScrollView(activity);
        sv.setVerticalScrollBarEnabled(false);
        sv.addView(root);
        final Dialog dialog = ui.dialog(sv);
        render(activity, ui, root, dialog);
        dialog.show();
    }

    // ------------------------------------------------------------------ small building blocks

    /** A quiet panel inside the pop-up: 20dp outside - 8dp inset = 12dp corners, 12dp inside padding. */
    private static LinearLayout group(WcaUi ui) {
        LinearLayout g = new LinearLayout(ui.ctx);
        g.setOrientation(LinearLayout.VERTICAL);
        g.setPadding(ui.dp(12), ui.dp(12), ui.dp(12), ui.dp(12));
        g.setBackground(ui.rounded(ui.highlight, ui.dp(WcaUi.inner(WcaUi.R_OUTER, WcaUi.INSET))));
        return g;
    }

    private static TextView small(WcaUi ui, String s) {
        TextView t = ui.text(s, 12, false, 0.75f);
        t.setPadding(ui.dp(2), ui.dp(4), ui.dp(2), ui.dp(2));
        return t;
    }

    private static LinearLayout.LayoutParams gap(WcaUi ui, int top) {
        return ui.matchWrap(0, top, 0, 0);
    }

    /** A pill with an icon, like the buttons in the share pop-up. */
    private static LinearLayout button(WcaUi ui, int iconRes, String label, boolean primary) {
        LinearLayout b = new LinearLayout(ui.ctx);
        b.setOrientation(LinearLayout.HORIZONTAL);
        b.setGravity(Gravity.CENTER);
        b.setMinimumHeight(ui.dp(44));
        b.setPadding(ui.dp(16), 0, ui.dp(16), 0);
        GradientDrawable g = ui.rounded(primary ? ui.highlight : ui.itemBg, ui.dp(22));
        g.setStroke(ui.dp(1), primary ? ui.accent : ((ui.itemText & 0x00FFFFFF) | 0x40000000));
        b.setBackground(g);
        b.setClickable(true);
        if (iconRes != 0) {
            ImageView icon = new ImageView(ui.ctx);
            icon.setImageDrawable(ui.tinted(iconRes, 18, ui.safe));
            icon.setTag("icon");
            b.addView(icon, ui.lp(ui.dp(18), ui.dp(18), 0, 0, 8, 0));
        }
        TextView t = ui.text(label, 14, true, 1f);
        t.setTextColor(ui.safe);
        t.setTag("label");
        b.addView(t);
        ui.pressable(b);
        return b;
    }

    private static void setLabel(View button, String s) {
        TextView t = button.findViewWithTag("label");
        if (t != null) t.setText(s);
    }

    private static void setIcon(WcaUi ui, View button, int res, int color) {
        ImageView i = button.findViewWithTag("icon");
        if (i != null) i.setImageDrawable(ui.tinted(res, 18, color));
    }

    private static EditText field(WcaUi ui, String hint, String value) {
        EditText e = ui.input(hint);
        if (value != null) e.setText(value);
        return e;
    }

    // ------------------------------------------------------------------ the screen

    private static void render(final Activity a, final WcaUi ui, final LinearLayout root, final Dialog dialog) {
        root.removeAllViews();

        // header: icon, title, one line of what this does
        LinearLayout head = new LinearLayout(a);
        head.setOrientation(LinearLayout.HORIZONTAL);
        head.setGravity(Gravity.CENTER_VERTICAL);
        head.setPadding(ui.dp(4), ui.dp(6), ui.dp(4), ui.dp(12));
        ImageView headIcon = new ImageView(a);
        headIcon.setImageDrawable(ui.tinted(R.drawable.ic_share_sync, 22, ui.accent));
        head.addView(headIcon, ui.lp(ui.dp(22), ui.dp(22), 0, 0, 10, 0));
        LinearLayout titles = new LinearLayout(a);
        titles.setOrientation(LinearLayout.VERTICAL);
        titles.addView(ui.text("Sync with the website", 18, true, 1f));
        TextView sub = ui.text("The same solves on your phone and in the browser", 12, false, 0.7f);
        titles.addView(sub);
        head.addView(titles, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        root.addView(head);

        if (!SyncManager.configured(a)) {
            LinearLayout g = group(ui);
            g.addView(ui.text("The sync server is not set up yet", 15, true, 1f));
            g.addView(small(ui, "Paste your Supabase project URL and anon key into res/values/sync.xml and rebuild. The steps are in supabase/README.md."));
            root.addView(g);
            return;
        }

        final String code = SyncManager.getCode(a);
        if (code.isEmpty()) {
            LinearLayout g = group(ui);
            g.addView(ui.text("Link this phone and the website", 15, true, 1f));
            g.addView(small(ui, "A sync code links them. No email or password. Keep the code private: anyone with it can see your solves."));
            final LinearLayout create = button(ui, R.drawable.ic_share_sync, "Create a new sync code", true);
            g.addView(create, gap(ui, 12));
            root.addView(g);

            LinearLayout g2 = group(ui);
            g2.addView(ui.text("Already have a code?", 15, true, 1f));
            final EditText in = field(ui, "Enter the code from the website", null);
            in.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS);
            g2.addView(in, gap(ui, 8));
            final LinearLayout use = button(ui, R.drawable.ic_share_check, "Use this code", false);
            g2.addView(use, gap(ui, 8));
            root.addView(g2, gap(ui, 8));

            create.setOnClickListener(v -> {
                SyncManager.setCode(a, SyncManager.makeCode());
                render(a, ui, root, dialog);
            });
            use.setOnClickListener(v -> {
                if (SyncManager.setCode(a, in.getText().toString())) {
                    render(a, ui, root, dialog);
                } else {
                    ui.shake(in);
                    setLabel(use, "That code looks too short");
                    use.postDelayed(() -> setLabel(use, "Use this code"), 1800);
                }
            });
            return;
        }

        // the code: tap it to copy
        final LinearLayout codeBox = group(ui);
        codeBox.setClickable(true);
        ui.pressable(codeBox);
        final TextView codeLabel = small(ui, "Your sync code  \u00B7  tap to copy");
        codeBox.addView(codeLabel);
        TextView codeView = ui.text(code, 22, true, 1f);
        codeView.setTypeface(Typeface.MONOSPACE, Typeface.BOLD);
        codeView.setLetterSpacing(0.06f);
        codeView.setGravity(Gravity.CENTER);
        codeView.setPadding(0, ui.dp(6), 0, ui.dp(4));
        codeBox.addView(codeView);
        codeBox.setOnClickListener(v -> {
            ClipboardManager cm = (ClipboardManager) a.getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("ZTimer sync code", code));
            codeLabel.setText("Copied");
            ui.pop(codeView);
            codeBox.postDelayed(() -> codeLabel.setText("Your sync code  \u00B7  tap to copy"), 1600);
        });
        root.addView(codeBox);

        // nickname
        LinearLayout nickBox = group(ui);
        nickBox.addView(ui.text("Nickname", 15, true, 1f));
        final EditText nick = field(ui, "Pick a nickname (optional)", SyncManager.getNick(a));
        nickBox.addView(nick, gap(ui, 8));
        nickBox.addView(small(ui, "3 to 20 letters, numbers or _. Nicknames are unique and will be used for friends and racing."));
        root.addView(nickBox, gap(ui, 8));

        // sync now and its status
        final LinearLayout syncBtn = button(ui, R.drawable.ic_share_sync, "Sync now", true);
        root.addView(syncBtn, gap(ui, 14));
        final TextView status = small(ui, lastText(a));
        status.setGravity(Gravity.CENTER);
        root.addView(status, gap(ui, 6));
        root.addView(small(ui, "It also syncs by itself a few seconds after each solve and when you open the app.") , gap(ui, 0));
        syncBtn.setOnClickListener(v -> {
            final ImageView ic = syncBtn.findViewWithTag("icon");
            ui.spin(ic, true);
            setLabel(syncBtn, "Syncing...");
            status.setText("Talking to the server...");
            SyncManager.sync(a, nick.getText().toString().trim(), (ok, msg) -> {
                ui.spin(ic, false);
                if (ok) {
                    setIcon(ui, syncBtn, R.drawable.ic_share_check, ui.accent);
                    setLabel(syncBtn, "Synced");
                    ui.pop(syncBtn);
                    status.setText("Done. " + msg);
                    syncBtn.postDelayed(() -> {
                        setIcon(ui, syncBtn, R.drawable.ic_share_sync, ui.safe);
                        setLabel(syncBtn, "Sync now");
                        status.setText(lastText(a));
                    }, 2200);
                } else {
                    setLabel(syncBtn, "Try again");
                    ui.shake(syncBtn);
                    status.setText(msg);
                }
            });
        });

        // stop syncing
        final LinearLayout stop = button(ui, 0, "Stop syncing on this phone", false);
        root.addView(stop, gap(ui, 14));
        stop.setOnClickListener(v -> {
            final Dialog confirm = new android.app.AlertDialog.Builder(a)
                    .setMessage("Stop syncing here? Your solves stay on this phone and on the server.")
                    .setPositiveButton("Stop syncing", (d, w) -> {
                        SyncManager.signOut(a);
                        render(a, ui, root, dialog);
                    }).setNegativeButton("Cancel", null).create();
            confirm.show();
        });

        final TextView done = ui.pill("Done", false);
        root.addView(done, ui.matchWrap(0, 8, 0, 4));
        done.setOnClickListener(v -> dialog.dismiss());
    }

    private static String lastText(Context c) {
        long t = SyncManager.getLast(c);
        return t == 0 ? "Not synced yet." : "Last synced: " + DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(new Date(t));
    }
}
