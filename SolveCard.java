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
import android.graphics.Path;
import android.graphics.Rect;
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
import android.widget.ScrollView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.content.res.ResourcesCompat;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.CubicTimer;
import com.hatopigeon.cubictimer.items.Solve;
import com.hatopigeon.cubictimer.stats.AverageCalculatorSuper;
import com.hatopigeon.cubictimer.stats.Statistics;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Locale;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static com.hatopigeon.cubictimer.stats.AverageCalculatorSuper.tr;

/**
 * The solve cards: pictures that can be saved to the gallery or sent to other apps. There is a card
 * for one solve, for an Ao5 or Ao12, for the time distribution and for the whole session.
 * They all share one look: the time in a box at the top left, the date and event beside it, the
 * content in the middle, and the logo and name at the bottom right. The colours follow the app theme.
 */
public final class SolveCard {
    private static final int W = 1080;
    private static final int H = 1350;
    private static final int M = 64;

    private static Typeface sBold;
    private static Typeface sMed;

    private SolveCard() {
    }

    // ------------------------------------------------------------------ what a card is made of

    private interface Body {
        void draw(Canvas c, RectF area, int fg);
    }

    private static final class Side {
        final String text;
        final boolean bold;
        final float size;
        final int alpha;

        Side(String text, boolean bold, float size, int alpha) {
            this.text = text == null ? "" : text;
            this.bold = bold;
            this.size = size;
            this.alpha = alpha;
        }
    }

    private static final class Spec {
        String big = "--";
        final List<Side> side = new ArrayList<>();
        Body body;
        String fileName = "card";
        String title = "Solve card";
    }

    // ------------------------------------------------------------------ drawing

    private static float fit(Paint p, String text, float size, float maxW) {
        p.setTextSize(size);
        float w = p.measureText(text);
        return w > maxW ? Math.max(18f, (float) Math.floor(size * maxW / w)) : size;
    }

    private static Paint fill(int color, int alpha) {
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setColor(color);
        p.setAlpha(alpha);
        return p;
    }

    private static Bitmap render(Context ctx, Spec spec) {
        Bitmap bmp = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bmp);
        int start = ThemeUtils.fetchAttrColor(ctx, R.attr.colorMainGradientStart);
        int end = ThemeUtils.fetchAttrColor(ctx, R.attr.colorMainGradientEnd);
        int fg = ThemeUtils.fetchAttrColor(ctx, R.attr.colorTimerText);
        Paint bg = new Paint(Paint.ANTI_ALIAS_FLAG);
        bg.setShader(new LinearGradient(0, 0, W * 0.6f, H, start, end, Shader.TileMode.CLAMP));
        c.drawRect(0, 0, W, H, bg);

        sBold = ResourcesCompat.getFont(ctx, R.font.quicksand_bold);
        sMed = ResourcesCompat.getFont(ctx, R.font.quicksand_medium);
        TextPaint p = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        p.setColor(fg);

        // the time, in a box
        p.setTypeface(sBold);
        float ts = fit(p, spec.big, 210f, 520f);
        p.setTextSize(ts);
        float bw = Math.round(p.measureText(spec.big) + 90f);
        float bh = 250f, bx = M, by = 64f;
        RectF box = new RectF(bx, by, bx + bw, by + bh);
        c.drawRoundRect(box, 40, 40, fill(fg, 46));
        Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
        stroke.setStyle(Paint.Style.STROKE);
        stroke.setStrokeWidth(8f);
        stroke.setColor(fg);
        c.drawRoundRect(box, 40, 40, stroke);
        p.setAlpha(255);
        p.setTextAlign(Paint.Align.CENTER);
        c.drawText(spec.big, bx + bw / 2f, by + bh / 2f + ts * 0.35f, p);

        // date and event beside it
        float sx = bx + bw + 40f, sw = W - M - sx;
        float[] sizes = new float[spec.side.size()];
        float tot = 0f;
        for (int i = 0; i < sizes.length; i++) {
            Side s = spec.side.get(i);
            p.setTypeface(s.bold ? sBold : sMed);
            sizes[i] = fit(p, s.text, s.size, sw);
            tot += sizes[i] * 1.35f;
        }
        float y = by + bh / 2f - tot / 2f;
        p.setTextAlign(Paint.Align.LEFT);
        for (int i = 0; i < sizes.length; i++) {
            Side s = spec.side.get(i);
            p.setTypeface(s.bold ? sBold : sMed);
            p.setTextSize(sizes[i]);
            p.setAlpha(s.alpha);
            y += sizes[i] * 1.05f;
            c.drawText(s.text, sx, y, p);
            y += sizes[i] * 0.3f;
        }

        // the middle
        if (spec.body != null) {
            spec.body.draw(c, new RectF(M, 372f, W - M, H - 150f), fg);
        }

        // logo and name, bottom right
        p.setTypeface(sBold);
        p.setTextSize(46f);
        p.setAlpha(230);
        p.setTextAlign(Paint.Align.RIGHT);
        float nameW = p.measureText("ZTimer");
        float fy = H - 62f;
        c.drawText("ZTimer", W - M, fy, p);
        try {
            Drawable logo = ContextCompat.getDrawable(ctx, R.mipmap.ic_launcher);
            if (logo != null) {
                float ls = 68f, lx = W - M - nameW - 18f - ls, ly = fy - 50f;
                Path clip = new Path();
                clip.addRoundRect(new RectF(lx, ly, lx + ls, ly + ls), 16f, 16f, Path.Direction.CW);
                c.save();
                c.clipPath(clip);
                logo.setBounds(Math.round(lx), Math.round(ly), Math.round(lx + ls), Math.round(ly + ls));
                logo.draw(c);
                c.restore();
            }
        } catch (Throwable ignored) {
            // the card is still fine without the logo
        }
        return bmp;
    }

    private static void pills(Canvas c, List<String> items, float cx, float cy) {
        TextPaint tp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
        tp.setTypeface(sBold);
        tp.setTextSize(34f);
        tp.setTextAlign(Paint.Align.CENTER);
        float[] ws = new float[items.size()];
        float tot = 16f * (items.size() - 1);
        for (int i = 0; i < ws.length; i++) {
            ws[i] = tp.measureText(items.get(i)) + 56f;
            tot += ws[i];
        }
        float x = cx - tot / 2f;
        Paint white = fill(0xFFFFFFFF, 235);
        for (int i = 0; i < ws.length; i++) {
            c.drawRoundRect(new RectF(x, cy - 30f, x + ws[i], cy + 30f), 30f, 30f, white);
            tp.setColor(0xFF1B1B2B);
            c.drawText(items.get(i), x + ws[i] / 2f, cy + 12f, tp);
            x += ws[i] + 16f;
        }
    }

    /**
     * Draws a scramble picture as large as it fits and really centred: the picture is drawn once at its final
     * size, its empty margins are measured and left out. The website does exactly the same.
     */
    private static void drawImageFit(Canvas c, Drawable image, RectF area) {
        if (image == null || area.width() < 40f || area.height() < 40f) return;
        try {
            Drawable d = image.getConstantState() != null ? image.getConstantState().newDrawable().mutate() : image;
            Rect oldBounds = d.copyBounds();
            int iw = d.getIntrinsicWidth(), ih = d.getIntrinsicHeight();
            if (iw <= 0 || ih <= 0) {
                iw = 300;
                ih = 300;
            }
            float s = Math.min(area.width() / iw, area.height() / ih);
            int bw = Math.max(1, Math.round(iw * s)), bh = Math.max(1, Math.round(ih * s));
            Bitmap bmp = Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888);
            d.setBounds(0, 0, bw, bh);
            d.draw(new Canvas(bmp));
            d.setBounds(oldBounds);
            int[] px = new int[bw * bh];
            bmp.getPixels(px, 0, bw, 0, 0, bw, bh);
            int minX = bw, minY = bh, maxX = -1, maxY = -1;
            for (int y = 0; y < bh; y++) {
                for (int x = 0; x < bw; x++) {
                    if ((px[y * bw + x] >>> 24) > 10) {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            Rect src = new Rect(0, 0, bw, bh);
            if (maxX >= minX && maxY >= minY && maxX - minX + 1 >= bw * 0.4f && maxY - minY + 1 >= bh * 0.4f) {
                src = new Rect(minX, minY, maxX + 1, maxY + 1);
            }
            float dw = src.width(), dh = src.height();
            float left = area.centerX() - dw / 2f, top = area.centerY() - dh / 2f;
            c.drawBitmap(bmp, src, new RectF(left, top, left + dw, top + dh), new Paint(Paint.FILTER_BITMAP_FLAG));
            bmp.recycle();
        } catch (Throwable ignored) {
            // the card is still fine without the picture
        }
    }

    private static Body solveBody(final Solve solve, final Drawable image, final List<String> badges) {
        return (c, a, fg) -> {
            float y = a.top;
            if (!badges.isEmpty()) {
                pills(c, badges, a.centerX(), y + 30f);
                y += 92f;
            }
            String scr = WideMoves.toPreferred(solve.getScramble() == null ? "" : solve.getScramble(), solve.getPuzzle());
            if (scr == null || scr.isEmpty()) scr = "-";
            TextPaint sp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            sp.setColor(0xFF1B1B2B);
            sp.setTypeface(sMed);
            sp.setTextSize(38f);
            StaticLayout layout = StaticLayout.Builder.obtain(scr, 0, scr.length(), sp, (int) (a.width() - 90f))
                    .setLineSpacing(52f - sp.getFontSpacing(), 1f)
                    .setAlignment(Layout.Alignment.ALIGN_CENTER).setMaxLines(5)
                    .setEllipsize(android.text.TextUtils.TruncateAt.END).build();
            float ph = layout.getHeight() + 50f;
            c.drawRoundRect(new RectF(a.left, y, a.right, y + ph), 36f, 36f, fill(0xFFFFFFFF, 235));
            c.save();
            c.translate(a.left + 45f, y + 25f);
            layout.draw(c);
            c.restore();
            y += ph + 28f;
            String cm = solve.getComment();
            if (cm != null && !cm.trim().isEmpty()) {
                cm = cm.trim();
                if (cm.length() > 60) cm = cm.substring(0, 58) + "...";
                TextPaint cp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
                cp.setColor(fg);
                cp.setAlpha(230);
                cp.setTypeface(sMed);
                cp.setTextSkewX(-0.2f);
                cp.setTextSize(34f);
                cp.setTextAlign(Paint.Align.CENTER);
                c.drawText("\u201C" + cm + "\u201D", a.centerX(), y + 30f, cp);
                y += 60f;
            }
            drawImageFit(c, image, new RectF(a.left, y, a.right, a.bottom));
        };
    }

    private static StaticLayout scrambleLayout(String text, TextPaint sp, int width, int maxLines) {
        StaticLayout.Builder bld = StaticLayout.Builder.obtain(text, 0, text.length(), sp, Math.max(10, width))
                .setAlignment(Layout.Alignment.ALIGN_NORMAL);
        if (maxLines > 0) {
            bld.setMaxLines(maxLines).setEllipsize(android.text.TextUtils.TruncateAt.END);
        }
        return bld.build();
    }

    /** One row per solve: its number, its time and, beside the time, the scramble of that solve. */
    private static Body listBody(final List<String> items, final boolean[] marks, final String[] scrambles) {
        return (c, a, fg) -> {
            int rows = items.size();
            float gap = rows > 6 ? 10f : 16f;
            float ch = Math.min(150f, (a.height() - gap * (rows - 1)) / rows);
            float th = rows * ch + (rows - 1) * gap;
            float y0 = a.top + Math.max(0f, (a.height() - th) / 2f);
            Paint white = fill(0xFFFFFFFF, 235);
            TextPaint num = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            num.setColor(0xFF7B7F9E);
            num.setTypeface(sBold);
            num.setTextSize(32f);
            TextPaint tp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            tp.setColor(0xFF1B1B2B);
            tp.setTypeface(sBold);
            float tsz = Math.min(56f, Math.round(ch * 0.5f));
            tp.setTextSize(tsz);
            float numW = 80f, timeW = 0f;
            for (int k = 0; k < rows; k++) {
                String t = marks[k] ? "(" + items.get(k) + ")" : items.get(k);
                timeW = Math.max(timeW, tp.measureText(t));
            }
            TextPaint sp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            sp.setColor(0xFF4A4E6B);
            sp.setTypeface(sMed);
            for (int k = 0; k < rows; k++) {
                float x = a.left, y = y0 + k * (ch + gap);
                c.drawRoundRect(new RectF(x, y, a.right, y + ch), 28f, 28f, white);
                c.drawText(String.valueOf(k + 1), x + 28f, y + ch / 2f + 11f, num);
                String t = marks[k] ? "(" + items.get(k) + ")" : items.get(k);
                c.drawText(t, x + numW, y + ch / 2f + tsz * 0.35f, tp);
                String scr = scrambles != null && k < scrambles.length ? scrambles[k] : null;
                if (scr == null || scr.trim().isEmpty()) continue;
                float sx = x + numW + timeW + 36f;
                int sw = (int) (a.right - 28f - sx);
                float budget = ch - 14f;
                StaticLayout lay = null;
                for (float size = 26f; size >= 13f; size -= 1f) {
                    sp.setTextSize(size);
                    sp.setTextScaleX(1f);
                    float spacing = sp.getFontSpacing();
                    lay = scrambleLayout(scr, sp, sw, 0);
                    if (lay.getHeight() <= budget) break;
                    if (size <= 13f) {
                        lay = scrambleLayout(scr, sp, sw, Math.max(1, (int) (budget / spacing)));
                    }
                }
                if (lay != null) {
                    c.save();
                    c.translate(sx, y + (ch - lay.getHeight()) / 2f);
                    lay.draw(c);
                    c.restore();
                }
            }
        };
    }

    private static Body tilesBody(final List<String[]> items) {
        return (c, a, fg) -> {
            int rows = (int) Math.ceil(items.size() / 2.0);
            float gap = 18f;
            float cw = (a.width() - gap) / 2f;
            float ch = Math.min(150f, (a.height() - gap * (rows - 1)) / rows);
            float y0 = a.top + Math.max(0f, (a.height() - (rows * ch + (rows - 1) * gap)) / 2f);
            Paint white = fill(0xFFFFFFFF, 235);
            TextPaint lab = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            lab.setColor(0xFF7B7F9E);
            lab.setTypeface(sBold);
            lab.setTextSize(30f);
            lab.setTextAlign(Paint.Align.CENTER);
            TextPaint val = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            val.setColor(0xFF1B1B2B);
            val.setTypeface(sBold);
            val.setTextAlign(Paint.Align.CENTER);
            for (int k = 0; k < items.size(); k++) {
                float x = a.left + (k % 2) * (cw + gap), y = y0 + (k / 2) * (ch + gap);
                c.drawRoundRect(new RectF(x, y, x + cw, y + ch), 28f, 28f, white);
                c.drawText(items.get(k)[0], x + cw / 2f, y + ch * 0.36f, lab);
                val.setTextSize(fit(val, items.get(k)[1], 56f, cw - 40f));
                c.drawText(items.get(k)[1], x + cw / 2f, y + ch * 0.78f, val);
            }
        };
    }

    private static Body distBody(final int[] counts, final String[] labels, final int total) {
        return (c, a, fg) -> {
            float py = a.top + 10f, ph = a.height() - 20f;
            c.drawRoundRect(new RectF(a.left, py, a.right, py + ph), 36f, 36f, fill(0xFFFFFFFF, 235));
            TextPaint tp = new TextPaint(Paint.ANTI_ALIAS_FLAG);
            tp.setTypeface(sBold);
            tp.setTextAlign(Paint.Align.CENTER);
            if (total < 3 || counts.length == 0) {
                tp.setColor(0xFF1B1B2B);
                tp.setTextSize(40f);
                c.drawText("Needs at least 3 results", a.centerX(), py + ph / 2f, tp);
                return;
            }
            int mx = 1;
            for (int k : counts) if (k > mx) mx = k;
            float left = a.left + 36f, top = py + 70f, w = (a.width() - 72f) / counts.length, h = ph - 140f;
            Paint bar = fill(0xFF2962FF, 255);
            for (int j = 0; j < counts.length; j++) {
                float bh = h * counts[j] / mx, x = left + j * w;
                c.drawRoundRect(new RectF(x + 6f, top + h - Math.max(4f, bh), x + w - 6f, top + h), 10f, 10f, bar);
                if (counts[j] > 0) {
                    tp.setColor(0xFF1B1B2B);
                    tp.setTextSize(34f);
                    c.drawText(String.valueOf(counts[j]), x + w / 2f, top + h - bh - 12f, tp);
                }
                tp.setColor(0xFF7B7F9E);
                tp.setTextSize(fit(tp, labels[j], 30f, w - 6f));
                c.drawText(labels[j], x + w / 2f, top + h + 48f, tp);
            }
        };
    }

    // ------------------------------------------------------------------ the cards

    private static String eventName(Context ctx, String puzzle, String sub) {
        String title = PuzzleUtils.getPuzzleTitle(ctx, puzzle);
        if (sub != null && !sub.isEmpty() && !"Normal".equalsIgnoreCase(sub) && !"*".equals(sub)) {
            title += "  \u00B7  " + sub;
        }
        return title;
    }

    private static String day(long millis) {
        return new SimpleDateFormat("d MMM yyyy", Locale.ENGLISH).format(new Date(millis));
    }

    private static String time(long t, int format, String puzzle) {
        return PuzzleUtils.convertTimeToString(tr(t), format, puzzle);
    }

    private static Spec solveSpec(Context ctx, Solve solve, Drawable scrambleImage) {
        Spec s = new Spec();
        boolean dnf = solve.getPenalty() == PuzzleUtils.PENALTY_DNF;
        boolean plus2 = solve.getPenalty() == PuzzleUtils.PENALTY_PLUSTWO;
        s.big = dnf ? "DNF" : PuzzleUtils.convertTimeToString(
                plus2 ? solve.getTime() + 2000 : solve.getTime(), PuzzleUtils.FORMAT_SINGLE, solve.getPuzzle());
        s.side.add(new Side(eventName(ctx, solve.getPuzzle(), solve.getSubtype()), true, 50f, 255));
        s.side.add(new Side(day(solve.getDate()), false, 42f, 230));
        long[] t = null;
        try {
            t = CubicTimer.getDBHandler().getTimesUpTo(solve);
        } catch (Exception ignored) {
            // no extras then
        }
        List<String> badges = new ArrayList<>();
        if (t != null && t.length > 0) {
            s.side.add(new Side("Solve #" + t.length, false, 36f, 230));
            long mine = t[t.length - 1];
            boolean pb = mine >= 0 && t.length > 1;
            for (int k = 0; k < t.length - 1 && pb; k++) {
                if (t[k] >= 0 && t[k] <= mine) pb = false;
            }
            if (pb) badges.add("PB");
        }
        if (plus2) badges.add("+2");
        s.body = solveBody(solve, scrambleImage, badges.size() > 4 ? badges.subList(0, 4) : badges);
        s.fileName = "solve-" + solve.getDate();
        s.title = ctx.getString(R.string.list_options_item_share);
        return s;
    }

    private static Spec averageSpec(Context ctx, String puzzle, String category, int n, long avg, long[] times,
                                    int bestIdx, int worstIdx, String[] scrambles) {
        Spec s = new Spec();
        s.big = time(avg, PuzzleUtils.FORMAT_STATS, puzzle);
        s.side.add(new Side(eventName(ctx, puzzle, category), true, 50f, 255));
        s.side.add(new Side("Average of " + n, true, 44f, 240));
        s.side.add(new Side(day(System.currentTimeMillis()), false, 38f, 215));
        List<String> items = new ArrayList<>();
        boolean[] marks = new boolean[n];
        for (int i = 0; i < n && i < times.length; i++) {
            items.add(time(times[i], PuzzleUtils.FORMAT_SINGLE, puzzle));
            marks[i] = n >= 5 && (i == bestIdx || i == worstIdx);
        }
        s.body = listBody(items, marks, scrambles);
        s.fileName = "ao" + n;
        s.title = "Ao" + n;
        return s;
    }

    private static Spec distributionSpec(Context ctx, String puzzle, String category, Statistics stats) {
        Spec s = new Spec();
        s.big = time(stats.getSessionMeanTime(), PuzzleUtils.FORMAT_STATS, puzzle);
        int solves = stats.getSessionNumSolves();
        s.side.add(new Side(eventName(ctx, puzzle, category), true, 50f, 255));
        s.side.add(new Side("Time distribution", true, 44f, 240));
        s.side.add(new Side(solves + " solves  \u00B7  " + day(System.currentTimeMillis()), false, 38f, 215));

        // whole seconds, grouped so there are never more than about ten bars
        Map<Long, Integer> freqs = stats.getSessionTimeFrequencies();
        long lo = Long.MAX_VALUE, hi = -1;
        int total = 0;
        for (Map.Entry<Long, Integer> e : freqs.entrySet()) {
            long t = tr(e.getKey());
            if (t < 0 || t == Long.MAX_VALUE) continue;
            if (t < lo) lo = t;
            if (t > hi) hi = t;
            total += e.getValue();
        }
        int[] counts = new int[0];
        String[] labels = new String[0];
        if (total > 0) {
            long rangeSec = (hi - lo) / 1000 + 1;
            long group = Math.max(1, (long) Math.ceil(rangeSec / 10.0)) * 1000L;
            long first = (lo / group) * group;
            int bins = (int) ((hi - first) / group) + 1;
            counts = new int[bins];
            labels = new String[bins];
            for (Map.Entry<Long, Integer> e : freqs.entrySet()) {
                long t = tr(e.getKey());
                if (t < 0 || t == Long.MAX_VALUE) continue;
                counts[(int) ((t - first) / group)] += e.getValue();
            }
            for (int j = 0; j < bins; j++) {
                labels[j] = PuzzleUtils.convertTimeToString(first + j * group, PuzzleUtils.FORMAT_NO_MILLI_AXIS, puzzle);
            }
        }
        s.body = distBody(counts, labels, total);
        s.fileName = "distribution";
        s.title = "Time distribution";
        return s;
    }

    private static String avgOf(Statistics stats, int n, boolean best, String puzzle) {
        AverageCalculatorSuper ac = stats.getAverageOf(n, true);
        if (ac == null) return "--";
        return time(best ? ac.getBestAverage() : ac.getCurrentAverage(), PuzzleUtils.FORMAT_STATS, puzzle);
    }

    private static Spec sessionSpec(Context ctx, String puzzle, String category, Statistics stats) {
        Spec s = new Spec();
        s.big = time(stats.getSessionBestTime(), PuzzleUtils.FORMAT_STATS, puzzle);
        s.side.add(new Side(eventName(ctx, puzzle, category), true, 50f, 255));
        s.side.add(new Side("Session best", true, 44f, 240));
        s.side.add(new Side(stats.getSessionNumSolves() + " solves  \u00B7  " + day(System.currentTimeMillis()), false, 38f, 215));
        List<String[]> tiles = new ArrayList<>();
        tiles.add(new String[]{"Mean", time(stats.getSessionMeanTime(), PuzzleUtils.FORMAT_STATS, puzzle)});
        tiles.add(new String[]{"Worst", time(stats.getSessionWorstTime(), PuzzleUtils.FORMAT_STATS, puzzle)});
        tiles.add(new String[]{"Best Ao5", avgOf(stats, 5, true, puzzle)});
        tiles.add(new String[]{"Best Ao12", avgOf(stats, 12, true, puzzle)});
        tiles.add(new String[]{"Current Ao5", avgOf(stats, 5, false, puzzle)});
        tiles.add(new String[]{"Current Ao12", avgOf(stats, 12, false, puzzle)});
        tiles.add(new String[]{"Best Ao100", avgOf(stats, 100, true, puzzle)});
        tiles.add(new String[]{"Deviation", time(stats.getSessionStdDeviation(), PuzzleUtils.FORMAT_STATS, puzzle)});
        s.body = tilesBody(tiles);
        s.fileName = "session";
        s.title = "Session card";
        return s;
    }

    // ------------------------------------------------------------------ public entry points

    /** Shows the card of one solve with buttons to save or send it. {@code scrambleImage} may be null. */
    public static void show(final Activity activity, final Solve solve, Drawable scrambleImage) {
        final String scr = solve.getScramble();
        if (scrambleImage != null || scr == null || scr.trim().isEmpty()) {
            present(activity, solveSpec(activity, solve, scrambleImage));
            return;
        }
        // The dialog only makes the picture when it is shown, so make it here
        new Thread(() -> {
            Drawable made = null;
            try {
                made = new ScrambleGenerator(solve.getPuzzle()).generateImageFromScramble(
                        android.preference.PreferenceManager.getDefaultSharedPreferences(CubicTimer.getAppContext()), scr);
            } catch (Throwable ignored) {
                // no picture then
            }
            final Drawable fin = made;
            activity.runOnUiThread(() -> {
                if (!activity.isFinishing()) present(activity, solveSpec(activity, solve, fin));
            });
        }).start();
    }

    /** Shows the card of the latest Ao5 or Ao12 of the session. Returns false (and says why) if there is none yet. */
    public static boolean showAverage(Activity activity, String puzzle, String category, int n, Statistics stats) {
        AverageCalculatorSuper ac = stats == null ? null : stats.getAverageOf(n, true);
        AverageCalculatorSuper.AverageOfN aoN = ac == null ? null : ac.getAverageOfN();
        long[] times = aoN == null ? null : aoN.getTimes();
        if (aoN == null || times == null || aoN.getAverage() == AverageCalculatorSuper.UNKNOWN) {
            Toast.makeText(activity, R.string.fab_share_error, Toast.LENGTH_SHORT).show();
            return false;
        }
        // the scrambles of those solves, oldest first like the times
        String[] scrambles = null;
        try {
            List<Solve> recent = CubicTimer.getDBHandler().getRecentSolves(puzzle, category, n);
            if (recent.size() == n) {
                scrambles = new String[n];
                for (int i = 0; i < n; i++) {
                    String sc = recent.get(i).getScramble();
                    scrambles[i] = sc == null ? "" : WideMoves.toPreferred(sc, puzzle);
                }
            }
        } catch (Exception ignored) {
            // the card is fine without the scrambles
        }
        present(activity, averageSpec(activity, puzzle, category, n, aoN.getAverage(), times,
                aoN.getBestTimeIndex(), aoN.getWorstTimeIndex(), scrambles));
        return true;
    }

    /** Shows the card of the time distribution of the session. */
    public static boolean showDistribution(Activity activity, String puzzle, String category, Statistics stats) {
        if (stats == null || stats.getSessionNumSolves() <= 0) {
            Toast.makeText(activity, R.string.fab_share_error, Toast.LENGTH_SHORT).show();
            return false;
        }
        present(activity, distributionSpec(activity, puzzle, category, stats));
        return true;
    }

    /** Shows the summary card of the whole session. */
    public static boolean showSession(Activity activity, String puzzle, String category, Statistics stats) {
        if (stats == null || stats.getSessionNumSolves() <= 0) {
            Toast.makeText(activity, R.string.fab_share_error, Toast.LENGTH_SHORT).show();
            return false;
        }
        present(activity, sessionSpec(activity, puzzle, category, stats));
        return true;
    }

    // ------------------------------------------------------------------ saving and sending

    private static File cacheFile(Context ctx, String name) {
        File dir = new File(ctx.getCacheDir(), "solvecards");
        //noinspection ResultOfMethodCallIgnored
        dir.mkdirs();
        return new File(dir, "ztimer-" + name + ".png");
    }

    /** Sends the picture to another app. {@code pkg} names a specific app, or null to show the share sheet. */
    private static void share(Context ctx, Bitmap bmp, String name, String pkg) {
        try {
            File f = cacheFile(ctx, name);
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
                    ctx.startActivity(Intent.createChooser(send, "Share card"));
                }
            } else {
                ctx.startActivity(Intent.createChooser(send, "Share card"));
            }
        } catch (Exception e) {
            Toast.makeText(ctx, "Could not share the card.", Toast.LENGTH_SHORT).show();
        }
    }

    /** Saves the picture to the gallery (Pictures/ZTimer). */
    private static void save(Context ctx, Bitmap bmp, String base) {
        String name = "ztimer-" + base + "-" + System.currentTimeMillis() + ".png";
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

    /** Shows a card with buttons to save it or send it to Instagram, Facebook, Messenger, WhatsApp or any other app. */
    private static void present(final Activity activity, final Spec spec) {
        final Bitmap bmp = render(activity, spec);
        final String name = spec.fileName;
        LinearLayout root = new LinearLayout(activity);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(activity, 16), dp(activity, 16), dp(activity, 16), dp(activity, 8));

        ImageView pic = new ImageView(activity);
        pic.setImageBitmap(bmp);
        pic.setAdjustViewBounds(true);
        pic.setScaleType(ImageView.ScaleType.FIT_CENTER);
        root.addView(pic, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        LinearLayout top = new LinearLayout(activity);
        top.setOrientation(LinearLayout.HORIZONTAL);
        top.setGravity(Gravity.CENTER);
        top.addView(button(activity, "Save image", v -> save(activity, bmp, name)));
        top.addView(button(activity, "Share...", v -> share(activity, bmp, name, null)));
        root.addView(top);

        HorizontalScrollView scroll = new HorizontalScrollView(activity);
        scroll.setHorizontalScrollBarEnabled(false);
        LinearLayout apps = new LinearLayout(activity);
        apps.setOrientation(LinearLayout.HORIZONTAL);
        final String[][] targets = {
                {"Instagram", "com.instagram.android"}, {"Facebook", "com.facebook.katana"},
                {"Messenger", "com.facebook.orca"}, {"WhatsApp", "com.whatsapp"}};
        for (final String[] t : targets) {
            apps.addView(button(activity, t[0], v -> share(activity, bmp, name, t[1])));
        }
        scroll.addView(apps);
        root.addView(scroll);

        ScrollView sv = new ScrollView(activity);
        sv.addView(root);
        new AlertDialog.Builder(activity).setTitle(spec.title).setView(sv).setPositiveButton("Close", null).show();
    }
}
