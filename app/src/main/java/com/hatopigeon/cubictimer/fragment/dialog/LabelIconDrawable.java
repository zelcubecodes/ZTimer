package com.hatopigeon.cubictimer.fragment.dialog;

import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;

/** A rounded square with a short label, in the style of the built in puzzle icons. */
class LabelIconDrawable extends Drawable {
    private final String label;
    private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);

    LabelIconDrawable(String label, int fillColor, int textColor) {
        this.label = label;
        fill.setColor(fillColor);
        text.setColor(textColor);
        text.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        text.setTextAlign(Paint.Align.CENTER);
    }

    @Override
    public void draw(@NonNull Canvas canvas) {
        RectF r = new RectF(getBounds());
        float inset = r.width() * 0.06f;
        r.inset(inset, inset);
        canvas.drawRoundRect(r, r.width() * 0.2f, r.width() * 0.2f, fill);
        // Largest text that fits inside the square
        float size = r.height() * 0.5f;
        text.setTextSize(size);
        float width = text.measureText(label);
        float max = r.width() * 0.84f;
        if (width > max) text.setTextSize(size * max / width);
        float y = r.centerY() - (text.descent() + text.ascent()) / 2f;
        canvas.drawText(label, r.centerX(), y, text);
    }

    @Override public void setAlpha(int alpha) { fill.setAlpha(alpha); text.setAlpha(alpha); }
    @Override public void setColorFilter(ColorFilter cf) { fill.setColorFilter(cf); text.setColorFilter(cf); }
    @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }
}
