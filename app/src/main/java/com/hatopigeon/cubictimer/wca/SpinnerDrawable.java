package com.hatopigeon.cubictimer.wca;

import android.animation.ValueAnimator;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.RectF;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.view.animation.LinearInterpolator;

import androidx.annotation.NonNull;

/**
 * A small spinning arc for loading states. It can sit in a text view's compound drawables, so
 * "Loading..." lines get a spinner without any extra views.
 */
public class SpinnerDrawable extends Drawable implements Animatable {
    private final Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF arc = new RectF();
    private final ValueAnimator animator = ValueAnimator.ofFloat(0f, 360f);
    private float angle;

    public SpinnerDrawable(int color, float strokePx) {
        paint.setColor(color);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(strokePx);
        paint.setStrokeCap(Paint.Cap.ROUND);
        animator.setDuration(900);
        animator.setRepeatCount(ValueAnimator.INFINITE);
        animator.setInterpolator(new LinearInterpolator());
        animator.addUpdateListener(a -> {
            angle = (Float) a.getAnimatedValue();
            invalidateSelf();
        });
    }

    @Override
    public void draw(@NonNull Canvas canvas) {
        float half = paint.getStrokeWidth() / 2f;
        arc.set(getBounds());
        arc.inset(half, half);
        canvas.drawArc(arc, angle, 270f, false, paint);
    }

    @Override public void start() { if (!animator.isRunning()) animator.start(); }
    @Override public void stop() { animator.cancel(); }
    @Override public boolean isRunning() { return animator.isRunning(); }
    @Override public void setAlpha(int alpha) { paint.setAlpha(alpha); }
    @Override public void setColorFilter(ColorFilter cf) { paint.setColorFilter(cf); }
    @Override public int getOpacity() { return PixelFormat.TRANSLUCENT; }
}
