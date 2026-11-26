package com.hatopigeon.cubictimer.wca;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.app.Dialog;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.view.View;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.text.InputType;
import android.view.Gravity;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.core.graphics.ColorUtils;

import com.hatopigeon.cubicify.R;
import com.hatopigeon.cubictimer.utils.ThemeUtils;

/** Small helper that builds themed views in code for the WCA screens. */
public final class WcaUi {
    // ---- Design tokens, the same ones the original CubicTimer uses (see res/values/dimens.xml)
    /** Popups and full-width panels. */
    public static final float R_OUTER = 20;
    /** Solve boxes and result cards: the same 8dp as the boxes on the Previous Solves page. */
    public static final float R_CARD = 8;
    /** Distance between a panel's edge and the things inside it. */
    public static final float INSET = 8;

    /**
     * Corner radius for a shape that sits inside another rounded shape: the outer radius minus
     * the padding between them, so both curves stay concentric (20 - 8 = 12, 12 - 4 = 8).
     */
    public static float inner(float outerRadius, float padding) {
        return Math.max(outerRadius - padding, 2f);
    }

    public final Context ctx;
    public final int text;
    public final int bg;
    public final int panel;
    public final int highlight;
    /** Colors used by the Previous Solves boxes; the WCA boxes use the same ones. */
    public final int itemBg;
    public final int itemText;
    /** Text/icon colour that is readable on item surfaces even if the theme's own pair is not. */
    public final int safe;
    /** The blue the original CubicTimer uses for actions and selection. */
    public final int accent;

    public WcaUi(Context c) {
        ctx = c;
        text = ThemeUtils.fetchAttrColor(c, R.attr.colorTimerText);
        bg = ThemeUtils.fetchAttrColor(c, R.attr.colorPrimary);
        panel = ColorUtils.calculateLuminance(bg) > 0.5
                ? ColorUtils.blendARGB(bg, Color.WHITE, 0.6f)
                : ColorUtils.blendARGB(bg, Color.WHITE, 0.10f);
        itemBg = ThemeUtils.fetchAttrColor(c, R.attr.colorItemListBackground);
        itemText = ThemeUtils.fetchAttrColor(c, R.attr.colorItemListText);
        highlight = ColorUtils.blendARGB(itemBg, itemText, 0.16f);
        accent = ThemeUtils.fetchAttrColor(c, R.attr.colorItemListTextAction);
        int opaqueBg = ColorUtils.setAlphaComponent(itemBg, 255);
        int opaqueText = ColorUtils.setAlphaComponent(itemText, 255);
        if (ColorUtils.calculateContrast(opaqueText, opaqueBg) >= 3.0) {
            safe = itemText;
        } else {
            safe = ColorUtils.calculateLuminance(opaqueBg) > 0.5 ? 0xFF222222 : 0xFFF2F2F2;
        }
    }

    public int dp(float v) {
        return ThemeUtils.dpToPix(ctx, v);
    }

    public GradientDrawable rounded(int color, float radius) {
        GradientDrawable g = new GradientDrawable();
        g.setColor(color);
        g.setCornerRadius(radius);
        return g;
    }

    public TextView text(String s, float sp, boolean bold, float alpha) {
        TextView t = new com.hatopigeon.cubictimer.wca.FlagTextView(ctx);
        t.setText(s);
        t.setTextSize(sp);
        t.setTextColor(text);
        t.setAlpha(alpha);
        if (bold) t.setTypeface(t.getTypeface(), Typeface.BOLD);
        return t;
    }

    /** A button / segment. Fully rounded (20dp on a 40dp height), like the original accent buttons. */
    public TextView pill(String s, boolean selected) {
        TextView t = text(s, 14, true, 1f);
        t.setTextColor(safe);
        t.setGravity(Gravity.CENTER);
        t.setPadding(dp(16), 0, dp(16), 0);
        t.setMinHeight(dp(40));
        t.setClickable(true);
        t.setTag(R.id.wca_pill_selected, selected);
        applyPill(t, selected);
        pressable(t);
        return t;
    }

    /** Selected pills get the accent outline and a soft fill; the others a quiet hairline. */
    private void applyPill(TextView t, boolean selected) {
        GradientDrawable g = rounded(selected ? highlight : itemBg, dp(20));
        g.setStroke(dp(1), selected ? accent : ((itemText & 0x00FFFFFF) | 0x40000000));
        t.setBackground(g);
        t.setAlpha(selected ? 1f : 0.85f);
    }

    public void stylePill(TextView t, boolean selected) {
        Object before = t.getTag(R.id.wca_pill_selected);
        applyPill(t, selected);
        t.setTag(R.id.wca_pill_selected, selected);
        // Choosing a pill is acknowledged with a small pop; restyling an unchanged one is silent
        if (before instanceof Boolean && ((Boolean) before) != selected && selected) pop(t);
    }

    // ---------------------------------------------------------------- feedback animations

    /** Presses shrink the view a little and let it spring back, so taps feel registered. */
    @android.annotation.SuppressLint("ClickableViewAccessibility")
    public void pressable(final View v) {
        v.setOnTouchListener((view, ev) -> {
            switch (ev.getActionMasked()) {
                case android.view.MotionEvent.ACTION_DOWN:
                    view.animate().scaleX(0.96f).scaleY(0.96f).setDuration(90).start();
                    break;
                case android.view.MotionEvent.ACTION_UP:
                case android.view.MotionEvent.ACTION_CANCEL:
                    view.animate().scaleX(1f).scaleY(1f).setDuration(150)
                            .setInterpolator(new android.view.animation.OvershootInterpolator(2f)).start();
                    break;
            }
            return false;
        });
    }

    /** A short spring, for "this just changed" (starred, selected). */
    public void pop(View v) {
        v.animate().cancel();
        v.setScaleX(0.82f);
        v.setScaleY(0.82f);
        v.animate().scaleX(1f).scaleY(1f).setDuration(300)
                .setInterpolator(new android.view.animation.OvershootInterpolator(3f)).start();
    }

    /** A quick side to side wobble, for "that was not accepted" (an empty search). */
    public void shake(View v) {
        v.animate().cancel();
        android.animation.ObjectAnimator a = android.animation.ObjectAnimator.ofFloat(v, "translationX",
                0, -dp(8), dp(8), -dp(6), dp(6), -dp(3), 0);
        a.setDuration(340);
        a.start();
    }

    /** Spins an icon while something loads; call with false to settle it again. */
    public void spin(final View v, boolean on) {
        Object running = v.getTag(R.id.wca_spin);
        if (on) {
            if (running instanceof android.animation.ObjectAnimator) return;
            android.animation.ObjectAnimator a = android.animation.ObjectAnimator.ofFloat(v, "rotation", 0f, 360f);
            a.setDuration(800);
            a.setRepeatCount(android.animation.ValueAnimator.INFINITE);
            a.setInterpolator(new android.view.animation.LinearInterpolator());
            v.setTag(R.id.wca_spin, a);
            a.start();
        } else if (running instanceof android.animation.ObjectAnimator) {
            ((android.animation.ObjectAnimator) running).cancel();
            v.setTag(R.id.wca_spin, null);
            v.animate().rotation(v.getRotation() >= 180 ? 360f : 0f).setDuration(160).withEndAction(() -> v.setRotation(0)).start();
        }
    }

    /** Lets children of a container fade in as they are added (and nothing else animates). */
    public void fadeChildrenIn(android.view.ViewGroup g) {
        android.animation.LayoutTransition lt = new android.animation.LayoutTransition();
        lt.disableTransitionType(android.animation.LayoutTransition.DISAPPEARING);
        lt.disableTransitionType(android.animation.LayoutTransition.CHANGING);
        lt.disableTransitionType(android.animation.LayoutTransition.CHANGE_APPEARING);
        lt.disableTransitionType(android.animation.LayoutTransition.CHANGE_DISAPPEARING);
        lt.setDuration(android.animation.LayoutTransition.APPEARING, 180);
        lt.setStartDelay(android.animation.LayoutTransition.APPEARING, 0);
        g.setLayoutTransition(lt);
    }

    // ---------------------------------------------------------------- loading states

    /** A text view's start spinner, shown for as long as the text says something is loading. */
    private boolean isLoadingText(CharSequence s) {
        if (s == null) return false;
        String x = s.toString();
        return x.startsWith("Loading") || x.startsWith("Searching") || x.contains("Refreshing");
    }

    /** One grey placeholder card that gently pulses, standing in for a card that is still loading. */
    public View skeletonCard(int heightDp) {
        View v = new View(ctx);
        v.setBackground(rounded((itemBg & 0x00FFFFFF) | 0x66000000, dp(R_CARD)));
        v.setMinimumHeight(dp(heightDp));
        final android.animation.ObjectAnimator pulse = android.animation.ObjectAnimator.ofFloat(v, "alpha", 0.45f, 1f);
        pulse.setDuration(750);
        pulse.setRepeatMode(android.animation.ValueAnimator.REVERSE);
        pulse.setRepeatCount(android.animation.ValueAnimator.INFINITE);
        v.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override public void onViewAttachedToWindow(View view) { pulse.start(); }
            @Override public void onViewDetachedFromWindow(View view) { pulse.cancel(); }
        });
        return v;
    }

    // ---- skeletons: grey boxes shaped like the page that is loading, pulsing until the real data arrives

    /** Kinds of skeleton, one for each page that loads data. */
    public static final int SK_INFO = 0;
    public static final int SK_PEOPLE = 1;
    public static final int SK_EVENTS = 2;
    public static final int SK_SCHEDULE = 3;
    public static final int SK_RESULTS = 4;
    public static final int SK_PODIUMS = 5;
    public static final int SK_COMPS = 6;
    public static final int SK_PROFILE = 7;
    public static final int SK_RECORDS = 8;

    /** A grey bar standing in for a piece of text that has not arrived yet. widthDp -1 fills the width. */
    public View skBar(int widthDp, int heightDp) {
        View v = new View(ctx);
        v.setBackground(rounded((text & 0x00FFFFFF) | 0x26000000, dp(4)));
        v.setLayoutParams(new LinearLayout.LayoutParams(widthDp < 0 ? ViewGroup.LayoutParams.MATCH_PARENT : dp(widthDp), dp(heightDp)));
        return v;
    }

    /** A grey circle or rounded square, for a flag, a picture or an event icon. */
    public View skBlock(int sizeDp, boolean round) {
        View v = new View(ctx);
        v.setBackground(rounded((text & 0x00FFFFFF) | 0x26000000, round ? dp(sizeDp) / 2f : dp(6)));
        v.setLayoutParams(new LinearLayout.LayoutParams(dp(sizeDp), dp(sizeDp)));
        return v;
    }

    private LinearLayout skCard() {
        LinearLayout c = new LinearLayout(ctx);
        c.setOrientation(LinearLayout.VERTICAL);
        c.setPadding(dp(14), dp(12), dp(14), dp(12));
        c.setBackground(rounded(itemBg, dp(R_CARD)));
        return c;
    }

    private LinearLayout skRow(int padV) {
        LinearLayout r = new LinearLayout(ctx);
        r.setOrientation(LinearLayout.HORIZONTAL);
        r.setGravity(Gravity.CENTER_VERTICAL);
        r.setPadding(0, dp(padV), 0, dp(padV));
        return r;
    }

    private LinearLayout.LayoutParams skGap(int w, int h, int l, int t, int r, int b) {
        return lp(w < 0 ? ViewGroup.LayoutParams.MATCH_PARENT : dp(w), dp(h), l, t, r, b);
    }

    /** Makes a view pulse gently while it is on screen. The delay staggers cards into a wave. */
    private void skPulse(final View v, final long delay) {
        final android.animation.ObjectAnimator pulse = android.animation.ObjectAnimator.ofFloat(v, "alpha", 0.5f, 1f);
        pulse.setDuration(750);
        pulse.setStartDelay(delay);
        pulse.setRepeatMode(android.animation.ValueAnimator.REVERSE);
        pulse.setRepeatCount(android.animation.ValueAnimator.INFINITE);
        v.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override public void onViewAttachedToWindow(View view) { pulse.start(); }
            @Override public void onViewDetachedFromWindow(View view) { pulse.cancel(); view.setAlpha(1f); }
        });
    }

    private void skAdd(LinearLayout box, View card, int index) {
        skPulse(card, index * 90L);
        box.addView(card, lp(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, 0, 4, 0, 4));
    }

    /** One list card: a round picture on the left, two lines of text, and something small on the right. */
    private LinearLayout skListCard(boolean pic, int line1, int line2, boolean right) {
        LinearLayout card = skCard();
        LinearLayout row = skRow(2);
        if (pic) row.addView(skBlock(36, true), lp(dp(36), dp(36), 0, 0, 12, 0));
        LinearLayout mid = new LinearLayout(ctx);
        mid.setOrientation(LinearLayout.VERTICAL);
        mid.addView(skBar(line1, 16), skGap(line1, 16, 0, 0, 0, 7));
        mid.addView(skBar(line2, 11), skGap(line2, 11, 0, 0, 0, 0));
        LinearLayout.LayoutParams mp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f);
        row.addView(mid, mp);
        if (right) row.addView(skBar(52, 18), skGap(52, 18, 8, 0, 0, 0));
        card.addView(row);
        return card;
    }

    /** A table card: a header line, then rows of place, name and one or two result columns. */
    private LinearLayout skTableCard(int rows, boolean twoCols) {
        LinearLayout card = skCard();
        card.setPadding(dp(14), dp(10), dp(14), dp(10));
        LinearLayout head = skRow(8);
        head.addView(skBar(24, 10), skGap(24, 10, 0, 0, 14, 0));
        head.addView(skBar(70, 10), skGap(70, 10, 0, 0, 0, 0));
        card.addView(head);
        for (int i = 0; i < rows; i++) {
            LinearLayout r = skRow(9);
            r.addView(skBar(22, 15), skGap(22, 15, 0, 0, 14, 0));
            LinearLayout.LayoutParams np = new LinearLayout.LayoutParams(0, dp(15), 1f);
            np.rightMargin = dp(12);
            View name = skBar(-1, 15);
            name.setLayoutParams(np);
            r.addView(name);
            r.addView(skBar(48, 15), skGap(48, 15, 0, 0, twoCols ? 12 : 0, 0));
            if (twoCols) r.addView(skBar(48, 15), skGap(48, 15, 0, 0, 0, 0));
            card.addView(r);
        }
        return card;
    }

    /** A strip of event icons, like the event picker at the top of a competition page. */
    private LinearLayout skEventStrip() {
        LinearLayout card = skCard();
        card.setPadding(dp(8), dp(6), dp(8), dp(6));
        LinearLayout row = new LinearLayout(ctx);
        row.setOrientation(LinearLayout.HORIZONTAL);
        for (int i = 0; i < 7; i++) row.addView(skBlock(28, false), lp(dp(28), dp(28), 8, 8, 8, 8));
        card.addView(row);
        return card;
    }

    /**
     * What a page shows while its data loads: boxes in the shape of the page, without the text,
     * pulsing in a wave. The real content replaces them when it arrives.
     */
    public LinearLayout skeleton(int kind) {
        LinearLayout box = new LinearLayout(ctx);
        box.setOrientation(LinearLayout.VERTICAL);
        int i = 0;
        switch (kind) {
            case SK_INFO: {
                LinearLayout card = skCard();
                card.addView(skBar(210, 22), skGap(210, 22, 0, 0, 0, 12));
                int[][] rows = {{60, 150}, {64, 190}, {56, 120}, {70, 170}, {76, 140}};
                for (int[] rw : rows) {
                    LinearLayout r = skRow(6);
                    r.addView(skBar(rw[0], 12), skGap(rw[0], 12, 0, 0, 16, 0));
                    r.addView(skBar(rw[1], 14), skGap(rw[1], 14, 0, 0, 0, 0));
                    card.addView(r);
                }
                LinearLayout icons = new LinearLayout(ctx);
                icons.setOrientation(LinearLayout.HORIZONTAL);
                for (int k = 0; k < 7; k++) icons.addView(skBlock(28, false), lp(dp(28), dp(28), 0, 0, 12, 0));
                card.addView(icons, matchWrap(0, 12, 0, 0));
                skAdd(box, card, i++);
                LinearLayout about = skCard();
                about.addView(skBar(60, 13), skGap(60, 13, 0, 0, 0, 10));
                about.addView(skBar(-1, 12), skGap(-1, 12, 0, 0, 0, 7));
                about.addView(skBar(-1, 12), skGap(-1, 12, 0, 0, 0, 7));
                about.addView(skBar(180, 12), skGap(180, 12, 0, 0, 0, 0));
                skAdd(box, about, i++);
                break;
            }
            case SK_PEOPLE:
                skAdd(box, skEventStrip(), i++);
                skAdd(box, skTableCard(9, true), i++);
                break;
            case SK_EVENTS:
                for (int k = 0; k < 5; k++) {
                    LinearLayout card = skCard();
                    LinearLayout row = skRow(2);
                    row.addView(skBlock(30, false), lp(dp(30), dp(30), 0, 0, 12, 0));
                    row.addView(skBar(130 - (k % 3) * 18, 17), skGap(130 - (k % 3) * 18, 17, 0, 0, 0, 0));
                    card.addView(row);
                    card.addView(skBar(-1, 11), skGap(-1, 11, 0, 8, 40, 0));
                    card.addView(skBar(160, 11), skGap(160, 11, 0, 7, 0, 0));
                    skAdd(box, card, i++);
                }
                break;
            case SK_SCHEDULE: {
                LinearLayout tabs = skCard();
                tabs.setPadding(dp(14), dp(10), dp(14), dp(10));
                LinearLayout tr = new LinearLayout(ctx);
                tr.setOrientation(LinearLayout.HORIZONTAL);
                for (int k = 0; k < 3; k++) tr.addView(skBar(78, 28), skGap(78, 28, 0, 0, 8, 0));
                tabs.addView(tr);
                skAdd(box, tabs, i++);
                LinearLayout card = skCard();
                for (int k = 0; k < 7; k++) {
                    LinearLayout r = skRow(8);
                    r.addView(skBar(44, 13), skGap(44, 13, 0, 0, 12, 0));
                    r.addView(skBlock(22, false), lp(dp(22), dp(22), 0, 0, 10, 0));
                    r.addView(skBar(120 + (k % 3) * 24, 14), skGap(120 + (k % 3) * 24, 14, 0, 0, 0, 0));
                    card.addView(r);
                }
                skAdd(box, card, i++);
                break;
            }
            case SK_RESULTS:
                skAdd(box, skEventStrip(), i++);
                skAdd(box, skTableCard(8, true), i++);
                break;
            case SK_PODIUMS:
                for (int k = 0; k < 3; k++) {
                    LinearLayout card = skCard();
                    LinearLayout head = skRow(2);
                    head.addView(skBlock(26, false), lp(dp(26), dp(26), 0, 0, 10, 0));
                    head.addView(skBar(110, 16), skGap(110, 16, 0, 0, 0, 0));
                    card.addView(head);
                    for (int p = 0; p < 3; p++) {
                        LinearLayout r = skRow(7);
                        r.addView(skBlock(18, true), lp(dp(18), dp(18), 0, 0, 12, 0));
                        LinearLayout.LayoutParams np = new LinearLayout.LayoutParams(0, dp(14), 1f);
                        np.rightMargin = dp(12);
                        View nm = skBar(-1, 14);
                        nm.setLayoutParams(np);
                        r.addView(nm);
                        r.addView(skBar(50, 14), skGap(50, 14, 0, 0, 0, 0));
                        card.addView(r);
                    }
                    skAdd(box, card, i++);
                }
                break;
            case SK_COMPS:
                for (int k = 0; k < 6; k++) skAdd(box, skListCard(true, 170 - (k % 3) * 24, 96, true), i++);
                break;
            case SK_PROFILE: {
                LinearLayout card = skCard();
                LinearLayout head = skRow(2);
                head.addView(skBlock(64, true), lp(dp(64), dp(64), 0, 0, 14, 0));
                LinearLayout mid = new LinearLayout(ctx);
                mid.setOrientation(LinearLayout.VERTICAL);
                mid.addView(skBar(170, 20), skGap(170, 20, 0, 0, 0, 8));
                mid.addView(skBar(110, 12), skGap(110, 12, 0, 0, 0, 8));
                mid.addView(skBar(140, 12), skGap(140, 12, 0, 0, 0, 0));
                head.addView(mid);
                card.addView(head);
                skAdd(box, card, i++);
                skAdd(box, skTableCard(7, true), i++);
                break;
            }
            case SK_RECORDS:
                for (int k = 0; k < 4; k++) skAdd(box, skListCard(false, 150 - (k % 2) * 30, 100, true), i++);
                break;
            default:
                for (int k = 0; k < 3; k++) skAdd(box, skListCard(true, 150, 90, false), i++);
                break;
        }
        return box;
    }

    /** What a page shows while its data loads: boxes shaped like the page, without the text. */
    public LinearLayout loadingBlock(int kind) {
        return skeleton(kind);
    }

    /** Older form kept for callers that only know a message and a card count. */
    public LinearLayout loadingBlock(String message, int cards) {
        LinearLayout box = new LinearLayout(ctx);
        box.setOrientation(LinearLayout.VERTICAL);
        for (int i = 0; i < cards; i++) {
            skAdd(box, skListCard(true, 150, 90, false), i);
        }
        return box;
    }

    /** A solve box: same background and corner radius as the boxes on the Previous Solves page. */
    public LinearLayout card(boolean highlighted) {
        LinearLayout c = new LinearLayout(ctx);
        c.setOrientation(LinearLayout.VERTICAL);
        c.setPadding(dp(14), dp(12), dp(14), dp(12));
        GradientDrawable g = rounded(highlighted ? highlight : itemBg, dp(8));
        if (highlighted) g.setStroke(dp(2), (itemText & 0x00FFFFFF) | 0x66000000);
        c.setBackground(g);
        c.setOnHierarchyChangeListener(new ViewGroup.OnHierarchyChangeListener() {
            @Override
            public void onChildViewAdded(View parent, View child) {
                recolor(child, text, safe);
            }

            @Override
            public void onChildViewRemoved(View parent, View child) {
            }
        });
        return c;
    }

    /** Text made with text() uses the page text color; inside a box it must use the box text color. */
    public void recolor(View v, int from, int to) {
        if (v instanceof TextView && !(v instanceof EditText)) {
            TextView t = (TextView) v;
            if (!"badge".equals(t.getTag()) && t.getCurrentTextColor() == from) t.setTextColor(to);
        }
        if (v instanceof ViewGroup) {
            ViewGroup g = (ViewGroup) v;
            for (int i = 0; i < g.getChildCount(); i++) recolor(g.getChildAt(i), from, to);
        }
    }

    // ---------------------------------------------------------------- icons

    public Drawable eventIcon(String eventId, int sizeDp, int color) {
        if (eventId == null) return null;
        int res = ctx.getResources().getIdentifier("ic_event_" + eventId.toLowerCase(java.util.Locale.US),
                "drawable", ctx.getPackageName());
        if (res == 0) return null;
        return tinted(res, sizeDp, color);
    }

    public Drawable tinted(int resId, int sizeDp, int color) {
        Drawable d = androidx.core.content.ContextCompat.getDrawable(ctx, resId);
        if (d == null) return null;
        d = androidx.core.graphics.drawable.DrawableCompat.wrap(d.mutate());
        androidx.core.graphics.drawable.DrawableCompat.setTint(d, color);
        d.setBounds(0, 0, dp(sizeDp), dp(sizeDp));
        return d;
    }

    /** Puts the event's icon to the left of a text view's text. Does nothing if there is no icon. */
    public void setEventIcon(TextView t, String eventId, int sizeDp, int color) {
        Drawable d = eventIcon(eventId, sizeDp, color);
        if (d == null) return;
        t.setCompoundDrawablesRelative(d, null, null, null);
        t.setCompoundDrawablePadding(dp(6));
    }

    public ImageView iconButton(int resId, int sizeDp, int color) {
        ImageView v = new ImageView(ctx);
        v.setImageDrawable(tinted(resId, sizeDp, color));
        v.setScaleType(ImageView.ScaleType.CENTER);
        v.setMinimumWidth(dp(48));   // 48dp touch target, same token as the rest of the app
        v.setMinimumHeight(dp(48));
        android.util.TypedValue tv = new android.util.TypedValue();
        if (ctx.getTheme().resolveAttribute(android.R.attr.selectableItemBackgroundBorderless, tv, true)) {
            v.setBackgroundResource(tv.resourceId);
        }
        v.setClickable(true);
        pressable(v);
        return v;
    }

    /** One full turn, as the acknowledgement of a tap on a refresh button. */
    public void spinOnce(View v) {
        v.animate().cancel();
        v.setRotation(0f);
        v.animate().rotationBy(360f).setDuration(600)
                .setInterpolator(new android.view.animation.DecelerateInterpolator()).start();
    }

    // ---------------------------------------------------------------- profile pictures

    /** Picture URL from an object that has an "avatar" child (WCA person or search result). "" for none/default. */
    public static String avatarUrl(org.json.JSONObject owner, boolean large) {
        if (owner == null) return "";
        org.json.JSONObject a = owner.optJSONObject("avatar");
        if (a == null || a.optBoolean("is_default", false)) return "";
        String u = large ? a.optString("url", "") : a.optString("thumb_url", a.optString("url", ""));
        if (u.isEmpty() || "null".equals(u)) u = a.optString("url", "");
        return "null".equals(u) ? "" : u;
    }

    public static String initials(String name) {
        if (name == null) return "?";
        String[] parts = name.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (part.isEmpty() || !Character.isLetter(part.charAt(0))) continue;
            sb.append(Character.toUpperCase(part.charAt(0)));
            if (sb.length() == 2) break;
        }
        return sb.length() == 0 ? "?" : sb.toString();
    }

    /** A round profile picture. Shows a blank silhouette (like Facebook) until, and unless, the picture loads. */
    public android.widget.FrameLayout avatar(String name, String url, int sizeDp) {
        android.widget.FrameLayout f = new android.widget.FrameLayout(ctx);
        ImageView t = new ImageView(ctx);
        t.setScaleType(ImageView.ScaleType.FIT_END);
        t.setImageDrawable(tinted(R.drawable.ic_wca_person, sizeDp, 0xFF8A8D91));
        t.setPadding(dp(sizeDp * 0.12f), dp(sizeDp * 0.12f), dp(sizeDp * 0.12f), 0);
        android.graphics.drawable.GradientDrawable oval = new android.graphics.drawable.GradientDrawable();
        oval.setShape(android.graphics.drawable.GradientDrawable.OVAL);
        oval.setColor(0xFFDADDE1);
        t.setBackground(oval);
        t.setClipToOutline(true);
        t.setOutlineProvider(android.view.ViewOutlineProvider.BACKGROUND);
        f.addView(t, new android.widget.FrameLayout.LayoutParams(dp(sizeDp), dp(sizeDp)));
        f.setTag(Integer.valueOf(sizeDp));
        setAvatarUrl(f, url);
        return f;
    }

    /** Tapping the picture opens the whole picture, full screen. Does nothing without a real picture. */
    public void makeZoomable(android.widget.FrameLayout f, final String fullUrl) {
        if (fullUrl == null || fullUrl.isEmpty()) return;
        f.setOnClickListener(v -> {
            final Dialog d = new Dialog(ctx, android.R.style.Theme_Black_NoTitleBar_Fullscreen);
            ImageView iv = new ImageView(ctx);
            iv.setScaleType(ImageView.ScaleType.FIT_CENTER);
            iv.setBackgroundColor(0xE6000000);
            iv.setOnClickListener(x -> d.dismiss());
            try {
                com.bumptech.glide.Glide.with(iv).load(fullUrl).into(iv);
            } catch (Exception ignored) {
            }
            d.setContentView(iv);
            d.show();
        });
    }

    // ---------------------------------------------------------------- medals and record chips

    public static int medalColor(int place) {
        return place == 1 ? 0xFFFFC107 : place == 2 ? 0xFFB0BEC5 : 0xFFCD7F32;
    }

    public Drawable medalIcon(int place, int sizeDp) {
        return tinted(R.drawable.ic_wca_medal, sizeDp, medalColor(place));
    }

    /** A medal symbol followed by a count, e.g. a gold medal and 12. */
    public View medalCount(int place, int count, float sp) {
        LinearLayout l = new LinearLayout(ctx);
        l.setOrientation(LinearLayout.HORIZONTAL);
        l.setGravity(Gravity.CENTER_VERTICAL);
        ImageView iv = new ImageView(ctx);
        iv.setImageDrawable(medalIcon(place, 22));
        l.addView(iv, new LinearLayout.LayoutParams(dp(22), dp(22)));
        TextView t = text(String.valueOf(count), sp, true, 1f);
        t.setTextColor(safe);
        t.setPadding(dp(3), 0, dp(10), 0);
        l.addView(t);
        return l;
    }

    /** A record badge (WR, CR, NR) followed by a count. */
    public View recordCount(String tag, int count, float sp) {
        LinearLayout l = new LinearLayout(ctx);
        l.setOrientation(LinearLayout.HORIZONTAL);
        l.setGravity(Gravity.CENTER_VERTICAL);
        l.addView(badge(tag));
        TextView t = text(String.valueOf(count), sp, true, 1f);
        t.setTextColor(safe);
        t.setPadding(dp(4), 0, dp(10), 0);
        l.addView(t);
        return l;
    }

    public void setAvatarUrl(android.widget.FrameLayout f, String url) {
        if (url == null || url.isEmpty() || f.getChildCount() > 1) return;
        int size = f.getTag() instanceof Integer ? (Integer) f.getTag() : 40;
        ImageView iv = new ImageView(ctx);
        iv.setScaleType(ImageView.ScaleType.CENTER_CROP);
        f.addView(iv, new android.widget.FrameLayout.LayoutParams(dp(size), dp(size)));
        try {
            com.bumptech.glide.Glide.with(iv).load(url).circleCrop().into(iv);
        } catch (Exception ignored) {
        }
    }

    // ---------------------------------------------------------------- record badges

    public static int badgeColor(String tag) {
        switch (tag) {
            case "WR": return 0xFFFF5252;
            case "NR": return 0xFF00E676;
            case "PR": return 0xFFBDBDBD;
            default: return 0xFFFFEB3B; // CR and the named continents (AsR, ER, ...)
        }
    }

    public TextView badge(String tag) {
        TextView b = new com.hatopigeon.cubictimer.wca.FlagTextView(ctx);
        b.setText(tag);
        b.setTextSize(10);
        b.setTextColor(Color.BLACK);
        b.setTag("badge");
        b.setTypeface(b.getTypeface(), Typeface.BOLD);
        b.setPadding(dp(4), dp(1), dp(4), dp(1));
        b.setBackground(rounded(badgeColor(tag), dp(4)));
        return b;
    }

    /** Text color of a result that is a record: WR red, CR amber, NR green, PR blue. */
    public static int valueColor(String tag) {
        switch (tag) {
            case "WR": return 0xFFE53935;
            case "NR": return 0xFF00C853;
            case "PR": return 0xFF2196F3;
            default: return 0xFFF9A825;
        }
    }

    /**
     * A result with its record badge just after the number, at the top. The badge has its own
     * slot, so it never covers a digit and the numbers still line up between rows.
     */
    public LinearLayout resultCell(String label, String value, String tag, float sp, boolean bold) {
        return resultCell(label, value, tag, sp, bold, false);
    }

    /** Same, but start-aligned (for table columns whose header is also start-aligned). */
    public LinearLayout resultCell(String label, String value, String tag, float sp, boolean bold, boolean start) {
        return resultCell(label, value, tag, sp, bold, start, "");
    }

    /** Same, with the badge saying what the record is for: "single" or "avg". */
    public LinearLayout resultCell(String label, String value, String tag, float sp, boolean bold, boolean start,
                                   String kind) {
        LinearLayout f = new LinearLayout(ctx);
        f.setOrientation(LinearLayout.HORIZONTAL);
        f.setGravity(start ? (Gravity.START | Gravity.CENTER_VERTICAL) : Gravity.END);
        TextView t = text(label.isEmpty() ? value : label + " " + value, sp, bold, 1f);
        t.setGravity(start ? Gravity.START : Gravity.END);
        t.setPadding(0, start ? 0 : dp(7), 0, 0);
        boolean has = tag != null && !tag.isEmpty();
        if (has) t.setTextColor(valueColor(tag.toUpperCase(java.util.Locale.US)));
        f.addView(t, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));
        FrameLayout slot = new FrameLayout(ctx);
        if (has) {
            FrameLayout.LayoutParams bp = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    (start ? Gravity.CENTER_VERTICAL : Gravity.TOP) | Gravity.START);
            bp.leftMargin = dp(2);
            TextView b = badge(tag);
            if (kind != null && !kind.isEmpty()) b.setText(tag + " " + kind);
            slot.addView(b, bp);
        }
        boolean wide = has && kind != null && !kind.isEmpty();
        f.addView(slot, new LinearLayout.LayoutParams(wide ? ViewGroup.LayoutParams.WRAP_CONTENT : dp(28),
                ViewGroup.LayoutParams.WRAP_CONTENT));
        return f;
    }

    /** A heading or note with a solid, themed background (never transparent). */
    public TextView label(String s, float sp, boolean bold) {
        TextView t = text(s, sp, bold, 1f);
        styleLabel(t);
        return t;
    }

    public void styleLabel(TextView t) {
        t.setTextColor(safe);
        t.setPadding(dp(12), dp(8), dp(12), dp(8));
        t.setBackground(rounded(itemBg, dp(8)));
    }

    /** A status line that only shows while it has text, with a spinner while it says it is loading. */
    public TextView status(float sp) {
        final TextView t = text("", sp, false, 0.8f);
        t.setPadding(dp(4), dp(2), dp(4), dp(2));
        t.setVisibility(View.GONE);
        t.setGravity(Gravity.CENTER_VERTICAL);
        final SpinnerDrawable spinner = new SpinnerDrawable(safe, dp(2));
        spinner.setBounds(0, 0, dp(16), dp(16));
        t.setCompoundDrawablePadding(dp(8));
        t.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int a, int b, int c) {}
            @Override public void onTextChanged(CharSequence s, int a, int b, int c) {}
            @Override public void afterTextChanged(android.text.Editable e) {
                boolean show = e.length() != 0;
                boolean loading = isLoadingText(e);
                t.setCompoundDrawablesRelative(loading ? spinner : null, null, null, null);
                if (loading) spinner.start(); else spinner.stop();
                if (show && t.getVisibility() != View.VISIBLE) {
                    t.setVisibility(View.VISIBLE);
                    t.setAlpha(0f);
                    t.animate().alpha(0.8f).setDuration(160).start();
                } else {
                    t.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            }
        });
        t.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
            @Override public void onViewAttachedToWindow(View v) {
                if (isLoadingText(t.getText())) spinner.start();
            }
            @Override public void onViewDetachedFromWindow(View v) { spinner.stop(); }
        });
        return t;
    }

    // ---------------------------------------------------------------- dialog

    /** A rounded, themed pop-up. Colors come from the theme, so it follows light and dark themes. */
    public Dialog dialog(View content) {
        Dialog d = new Dialog(ctx);
        d.requestWindowFeature(Window.FEATURE_NO_TITLE);
        LinearLayout panel = new LinearLayout(ctx);
        panel.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable g = rounded(itemBg, dp(20));
        g.setStroke(dp(1), 0xB9999999);
        panel.setBackground(g);
        panel.setPadding(dp(INSET), dp(INSET), dp(INSET), dp(INSET));
        panel.addView(content, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        recolor(panel, text, safe);
        d.setContentView(panel);
        if (d.getWindow() != null) {
            d.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            int w = (int) (ctx.getResources().getDisplayMetrics().widthPixels * 0.92f);
            d.getWindow().setLayout(w, ViewGroup.LayoutParams.WRAP_CONTENT);
            d.getWindow().setWindowAnimations(R.style.PopupWindowAnimation);
        }
        d.setCanceledOnTouchOutside(true);
        return d;
    }

    public LinearLayout.LayoutParams lp(int w, int h, int l, int t, int r, int b) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(w, h);
        p.setMargins(dp(l), dp(t), dp(r), dp(b));
        return p;
    }

    public LinearLayout.LayoutParams matchWrap(int l, int t, int r, int b) {
        return lp(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT, l, t, r, b);
    }

    public EditText input(String hint) {
        EditText e = new EditText(ctx);
        e.setHint(hint);
        e.setSingleLine(true);
        e.setInputType(InputType.TYPE_CLASS_TEXT);
        e.setImeOptions(EditorInfo.IME_ACTION_SEARCH);
        e.setTextColor(safe);
        e.setHintTextColor((itemText & 0x00FFFFFF) | 0x88000000);
        e.setTextSize(16);
        e.setPadding(dp(20), dp(10), dp(16), dp(10));
        e.setMinHeight(dp(48));
        e.setGravity(Gravity.CENTER_VERTICAL);
        e.setBackground(rounded(itemBg, dp(24)));
        attachClear(e);
        return e;
    }

    /** Shows an X at the far right of a search box while it has text; tapping it clears the box. */
    public void attachClear(final EditText e) {
        final Drawable x = tinted(R.drawable.ic_wca_close, 20, safe);
        e.setCompoundDrawablePadding(dp(8));
        e.addTextChangedListener(new android.text.TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int a, int b, int c) {}
            @Override public void onTextChanged(CharSequence s, int a, int b, int c) {}
            @Override public void afterTextChanged(android.text.Editable ed) {
                e.setCompoundDrawablesRelative(null, null, ed.length() > 0 ? x : null, null);
            }
        });
        e.setOnTouchListener((v, ev) -> {
            if (ev.getAction() == android.view.MotionEvent.ACTION_UP && e.getText().length() > 0) {
                Drawable[] d = e.getCompoundDrawablesRelative();
                if (d[2] != null && ev.getX() >= e.getWidth() - e.getPaddingEnd() - d[2].getBounds().width() - dp(12)) {
                    e.setText("");
                    return true;
                }
            }
            return false;
        });
    }
}
