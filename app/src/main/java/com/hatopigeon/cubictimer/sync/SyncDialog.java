package com.hatopigeon.cubictimer.sync;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.text.InputType;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;

import com.hatopigeon.cubictimer.utils.ThemeUtils;

import java.text.DateFormat;
import java.util.Date;

/** The Sync screen: create or enter a sync code, pick a nickname, sync now. */
public final class SyncDialog {
    private SyncDialog() {
    }

    private static int dp(Context c, int v) {
        return ThemeUtils.dpToPix(c, v);
    }

    private static TextView text(Context c, String s, int sp, boolean bold) {
        TextView t = new TextView(c);
        t.setText(s);
        t.setTextSize(sp);
        if (bold) t.setTypeface(t.getTypeface(), android.graphics.Typeface.BOLD);
        t.setPadding(0, dp(c, 4), 0, dp(c, 4));
        return t;
    }

    private static Button button(Context c, String s, View.OnClickListener l) {
        Button b = new Button(c);
        b.setText(s);
        b.setAllCaps(false);
        b.setOnClickListener(l);
        return b;
    }

    public static void show(final Activity activity) {
        final LinearLayout root = new LinearLayout(activity);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(activity, 20), dp(activity, 16), dp(activity, 20), dp(activity, 8));
        final AlertDialog dialog = new AlertDialog.Builder(activity).setTitle("Sync with the website")
                .setView(root).setPositiveButton("Close", null).create();
        render(activity, root);
        dialog.show();
    }

    private static void render(final Activity a, final LinearLayout root) {
        root.removeAllViews();
        if (!SyncManager.configured(a)) {
            root.addView(text(a, "The sync server is not set up yet.", 16, true));
            root.addView(text(a, "Paste your Supabase project URL and anon key into res/values/sync.xml and rebuild. The steps are in supabase/README.md.", 14, false));
            return;
        }
        final String code = SyncManager.getCode(a);
        if (code.isEmpty()) {
            root.addView(text(a, "A sync code links this app and the website. No email or password. Keep the code private: anyone with it can see your solves.", 14, false));
            root.addView(button(a, "Create a new sync code", v -> {
                SyncManager.setCode(a, SyncManager.makeCode());
                render(a, root);
            }));
            final EditText in = new EditText(a);
            in.setHint("Or enter the code from the website");
            in.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS);
            root.addView(in, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
            root.addView(button(a, "Use this code", v -> {
                if (SyncManager.setCode(a, in.getText().toString())) render(a, root);
                else Toast.makeText(a, "That code looks too short.", Toast.LENGTH_SHORT).show();
            }));
            return;
        }

        root.addView(text(a, "Your sync code", 14, true));
        TextView codeView = text(a, code, 20, true);
        codeView.setTypeface(android.graphics.Typeface.MONOSPACE, android.graphics.Typeface.BOLD);
        codeView.setTextIsSelectable(true);
        root.addView(codeView);
        root.addView(button(a, "Copy code", v -> {
            ClipboardManager cm = (ClipboardManager) a.getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("ZTimer sync code", code));
            Toast.makeText(a, "Code copied", Toast.LENGTH_SHORT).show();
        }));

        root.addView(text(a, "Nickname", 14, true));
        final EditText nick = new EditText(a);
        nick.setHint("Pick a nickname (optional)");
        nick.setText(SyncManager.getNick(a));
        nick.setSingleLine(true);
        root.addView(nick, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(text(a, "3 to 20 letters, numbers or _. Nicknames are unique and will be used for friends and racing.", 12, false));

        final TextView status = text(a, lastText(a), 13, false);
        root.addView(button(a, "Sync now", v -> {
            status.setText("Syncing...");
            SyncManager.sync(a, nick.getText().toString().trim(), (ok, msg) -> {
                status.setText(ok ? "Done. " + msg : msg);
                if (ok) render(a, root);
            });
        }));
        root.addView(status);
        root.addView(button(a, "Stop syncing on this phone", v -> new AlertDialog.Builder(a)
                .setMessage("Stop syncing here? Your solves stay on this phone and on the server.")
                .setPositiveButton("Stop syncing", (d, w) -> {
                    SyncManager.signOut(a);
                    render(a, root);
                }).setNegativeButton("Cancel", null).show()));
    }

    private static String lastText(Context c) {
        long t = SyncManager.getLast(c);
        return t == 0 ? "Not synced yet." : "Last synced: " + DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(new Date(t));
    }
}
