package com.hatopigeon.cubictimer.layout;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;

/** A simple bar chart: one bar per group of times, with the count above it and the time below it. */
public class HistogramView extends View {
    private int[] counts = new int[0];
    private String[] labels = new String[0];
    private final Paint bar = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rect = new RectF();
    private final float density;

    public HistogramView(Context context) {
        this(context, null);
    }

    public HistogramView(Context context, AttributeSet attrs) {
        super(context, attrs);
        density = context.getResources().getDisplayMetrics().density;
        text.setTextAlign(Paint.Align.CENTER);
        text.setFakeBoldText(true);
        text.setTextSize(11 * density);
    }

    /** Sets what to draw and the colour of the bars and the text. */
    public void setData(int[] counts, String[] labels, int color) {
        this.counts = counts == null ? new int[0] : counts;
        this.labels = labels == null ? new String[0] : labels;
        bar.setColor(color);
        text.setColor(color);
        invalidate();
    }

    @Override
    protected void onMeasure(int widthSpec, int heightSpec) {
        int w = MeasureSpec.getSize(widthSpec);
        setMeasuredDimension(w, (int) (170 * density));
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        final int n = counts.length;
        if (n == 0) return;
        int max = 1;
        for (int c : counts) if (c > max) max = c;

        final float left = 4 * density, right = 4 * density, top = 18 * density, bottom = 22 * density;
        final float slot = (getWidth() - left - right) / n;
        final float chartH = getHeight() - top - bottom;
        final float gap = Math.min(4 * density, slot * 0.15f);
        // Fewer labels when the bars are narrow
        final int every = slot < 30 * density ? 2 : 1;
        for (int i = 0; i < n; i++) {
            float h = chartH * counts[i] / max;
            float x = left + i * slot;
            if (counts[i] > 0) {
                bar.setAlpha(230);
                rect.set(x + gap, top + chartH - h, x + slot - gap, top + chartH);
                canvas.drawRoundRect(rect, 3 * density, 3 * density, bar);
                canvas.drawText(String.valueOf(counts[i]), x + slot / 2f, top + chartH - h - 4 * density, text);
            }
            if (i % every == 0 && i < labels.length) {
                canvas.drawText(labels[i], x + slot / 2f, getHeight() - 6 * density, text);
            }
        }
    }
}
