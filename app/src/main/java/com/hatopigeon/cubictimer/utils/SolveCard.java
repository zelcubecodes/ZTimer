package com.hatopigeon.cubictimer.utils;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.core.content.FileProvider;
import androidx.core.content.res.ResourcesCompat;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.items.Solve;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.util.Date;

/**
 * The solve card: a picture of one solve (puzzle, time, date, scramble and its image) that can be
 * saved to the gallery or sent to other apps.
 */
public final class SolveCard {
    private static final int W = 1080;
    private static final int H = 1350;

    private SolveCard() {
    }

    /** Draws the card. {@code scrambleImage} may be null. */
    public static Bitmap render(Context ctx, Solve solve, Drawable scrambleImage) {
        Bitmap bmp = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bmp);
        int start = ThemeUtils.fetchAttrColor(ctx, R.attr.colorMainGradientStart);
        int end = ThemeUtils.fetchAttrColor(ctx, R.attr.colorMainGradientEnd);
        int fg = ThemeUtils.fetchAttrColor(ctx, R.attr.colorTimerText);
        Paint bg = new Paint(Paint.ANTI_ALIAS_FLAG);
        bg.setShader(new LinearGradient(0, 0, W * 0.6f, H, start, end, Shader.TileMode.CLAMP));
        c.drawRect(0, 0, W, H, bg);

        Typeface bold = ResourcesCompat.getFont(ctx, R.font.quicksand_bold);
        Typeface med = ResourcesCompat.getFont(ctx, R.font.quicksand_medium);
        TextPaint p = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        p.setColor(fg);
        p.setTextAlign(Paint.Align.CENTER);

        // puzzle and category
        String title = PuzzleUtils.getPuzzleTitle(ctx, solve.getPuzzle());
        String sub = solve.getSubtype();
        if (sub != null && !sub.isEmpty() && !"Normal".equalsIgnoreCase(sub) && !DatabaseHandlerAll(sub)) {
            title += "  \u00B7  " + sub;
        }
        p.setTypeface(bold);
        p.setTextSize(54);
        p.setAlpha(220);
        c.drawText(title, W / 2f, 150, p);

        // the time
        boolean dnf = solve.getPenalty() == PuzzleUtils.PENALTY_DNF;
        String time = dnf ? "DNF" : PuzzleUtils.convertTimeToString(
                solve.getPenalty() == PuzzleUtils.PENALTY_PLUSTWO ? solve.getTime() + 2000 : solve.getTime(),
                PuzzleUtils.FORMAT_SINGLE, solve.getPuzzle());
        p.setAlpha(255);
        p.setTextSize(time.length() > 6 ? 230 : 300);
        c.drawText(time, W / 2f, 470, p);

        // penalty and date
        DateFormat df = DateFormat.getDateInstance(DateFormat.LONG);
        String line = df.format(new Date(solve.getDate()));
        if (solve.getPenalty() == PuzzleUtils.PENALTY_PLUSTWO) line = "+2  \u00B7  " + line;
        p.setTypeface(med);
        p.setTextSize(48);
        p.setAlpha(210);
        c.drawText(line, W / 2f, 550, p);

        // scramble panel
        RectF panel = new RectF(70, 620, W - 70, 870);
        Paint white = new Paint(Paint.ANTI_ALIAS_FLAG);
        white.setColor(0xEBFFFFFF);
        c.drawRoundRect(panel, 36, 36, white);
        String scr = WideMoves.toPreferred(solve.getScramble() == null ? "" : solve.getScramble(), solve.getPuzzle());
        if (scr != null && !scr.isEmpty()) {
            TextPaint sp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            sp.setColor(0xFF1B1B2B);
            sp.setTypeface(bold);
            sp.setTextSize(40);
            StaticLayout layout = StaticLayout.Builder.obtain(scr, 0, scr.length(), sp, (int) (panel.width() - 80))
                    .setAlignment(Layout.Alignment.ALIGN_CENTER).setMaxLines(4)
                    .setEllipsize(android.text.TextUtils.TruncateAt.END).build();
            c.save();
            c.translate(panel.left + 40, panel.centerY() - layout.getHeight() / 2f);
            layout.draw(c);
            c.restore();
        }

        // scramble image
        if (scrambleImage != null) {
            int iw = scrambleImage.getIntrinsicWidth(), ih = scrambleImage.getIntrinsicHeight();
            if (iw <= 0 || ih <= 0) { iw = 300; ih = 300; }
            float scale = Math.min(520f / iw, 300f / ih);
            int dw = Math.round(iw * scale), dh = Math.round(ih * scale);
            int left = (W - dw) / 2, top = 910 + (300 - dh) / 2;
            Drawable d = scrambleImage.getConstantState() != null ? scrambleImage.getConstantState().newDrawable().mutate() : scrambleImage;
            d.setBounds(left, top, left + dw, top + dh);
            d.draw(c);
        }

        // footer
        p.setTypeface(bold);
        p.setTextSize(44);
        p.setAlpha(210);
        c.drawText("ZTimer", W / 2f, H - 60, p);
        return bmp;
    }

    private static boolean DatabaseHandlerAll(String sub) {
        return "*".equals(sub);
    }

    private static File cacheFile(Context ctx, Solve solve) {
        File dir = new File(ctx.getCacheDir(), "solvecards");
        //noinspection ResultOfMethodCallIgnored
        dir.mkdirs();
        return new File(dir, "ztimer-solve-" + solve.getId() + ".png");
    }

    /** Sends the picture to another app. {@code pkg} names a specific app, or null to show the share sheet. */
    private static void share(Context ctx, Bitmap bmp, Solve solve, String pkg) {
        try {
            File f = cacheFile(ctx, solve);
            try (OutputStream os = new FileOutputStream(f)) {
                bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
            }
            Uri uri = FileProvider.getUriForFile(ctx, ctx.getString(R.string.file_provider_authority), f);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("image/png");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            if (pkg != null) {
                send.setPackage(pkg);
                try {
                    ctx.startActivity(send);
                } catch (ActivityNotFoundException e) {
                    Toast.makeText(ctx, "That app is not installed. Pick another one.", Toast.LENGTH_SHORT).show();
                    send.setPackage(null);
                    ctx.startActivity(Intent.createChooser(send, "Share solve card"));
                }
            } else {
                ctx.startActivity(Intent.createChooser(send, "Share solve card"));
            }
        } catch (Exception e) {
            Toast.makeText(ctx, "Could not share the card.", Toast.LENGTH_SHORT).show();
        }
    }

    /** Saves the picture to the gallery (Pictures/ZTimer). */
    private static void save(Context ctx, Bitmap bmp, Solve solve) {
        String name = "ztimer-solve-" + solve.getDate() + ".png";
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues v = new ContentValues();
                v.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                v.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
                v.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/ZTimer");
                Uri uri = ctx.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
                if (uri == null) throw new IllegalStateException("no uri");
                try (OutputStream os = ctx.getContentResolver().openOutputStream(uri)) {
                    bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
                }
                Toast.makeText(ctx, "Saved to Pictures/ZTimer", Toast.LENGTH_SHORT).show();
            } else {
                // Older phones: the gallery folder needs a storage permission this app does not ask for,
                // so keep it in the app's own picture folder and say where it is.
                File dir = ctx.getExternalFilesDir(android.os.Environment.DIRECTORY_PICTURES);
                if (dir == null) throw new IllegalStateException("no dir");
                File f = new File(dir, name);
                try (OutputStream os = new FileOutputStream(f)) {
                    bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
                }
                Toast.makeText(ctx, "Saved to " + f.getAbsolutePath(), Toast.LENGTH_LONG).show();
            }
        } catch (Exception e) {
            Toast.makeText(ctx, "Could not save the card.", Toast.LENGTH_SHORT).show();
        }
    }

    private static int dp(Context ctx, int v) {
        return ThemeUtils.dpToPix(ctx, v);
    }

    private static Button button(Context ctx, String label, View.OnClickListener l) {
        Button b = new Button(ctx);
        b.setText(label);
        b.setAllCaps(false);
        b.setOnClickListener(l);
        return b;
    }

    /** Shows the card with buttons to save it or send it to Instagram, Facebook, Messenger, WhatsApp or any other app. */
    public static void show(final Activity activity, final Solve solve, Drawable scrambleImage) {
        final Bitmap bmp = render(activity, solve, scrambleImage);
        LinearLayout root = new LinearLayout(activity);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(activity, 16), dp(activity, 16), dp(activity, 16), dp(activity, 8));

        ImageView pic = new ImageView(activity);
        pic.setImageBitmap(bmp);
        pic.setAdjustViewBounds(true);
        pic.setScaleType(ImageView.ScaleType.FIT_CENTER);
        root.addView(pic, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(activity, 360)));

        LinearLayout top = new LinearLayout(activity);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER);
        top.addView(button(activity, "Save image", v -> save(activity, bmp, solve)));
        top.addView(button(activity, "Share...", v -> share(activity, bmp, solve, null)));
        root.addView(top);

        HorizontalScrollView scroll = new HorizontalScrollView(activity);
        scroll.setHorizontalScrollBarEnabled(false);
        LinearLayout apps = new LinearLayout(activity);
        apps.setOrientation(LinearLayout.HORIZONTAL);
        final String[][] targets = {
                {"Instagram", "com.instagram.android"}, {"Facebook", "com.facebook.katana"},
                {"Messenger", "com.facebook.orca"}, {"WhatsApp", "com.whatsapp"}};
        for (final String[] t : targets) {
            apps.addView(button(activity, t[0], v -> share(activity, bmp, solve, t[1])));
        }
        scroll.addView(apps);
        root.addView(scroll);

        new AlertDialog.Builder(activity).setView(root).setPositiveButton("Close", null).show();
    }
}
