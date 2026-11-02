package com.hatopigeon.cubictimer.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Runs csTimer's own scramble code (assets/cstimer_bundle.js) in a hidden WebView, so the trainer
 * gives the same scrambles csTimer does. The WebView lives in a separate process and never draws
 * anything; only the Java calls here wait for it.
 *
 * csTimer is GPL-3.0, like this app: https://github.com/cs0x7f/cstimer
 */
public final class CsTimer {

    private static final String TAG = "CSTIMER";
    private static final String ASSET = "cstimer_bundle.js";
    private static final long TIMEOUT_SECONDS = 30;

    private static CsTimer instance;

    private final Context appContext;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final CountDownLatch ready = new CountDownLatch(1);
    private WebView web;
    private volatile boolean failed;

    private CsTimer(Context context) {
        this.appContext = context.getApplicationContext();
        start();
    }

    public static synchronized CsTimer get(Context context) {
        if (instance == null) instance = new CsTimer(context);
        return instance;
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void start() {
        main.post(() -> {
            try {
                String js = readAsset();
                // Nothing in the page may end the script early.
                js = js.replace("</script", "<\\/script");
                web = new WebView(appContext);
                web.getSettings().setJavaScriptEnabled(true);
                web.getSettings().setAllowFileAccess(false);
                web.setWebViewClient(new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        ready.countDown();
                    }
                });
                web.loadDataWithBaseURL("https://cstimer.invalid/",
                        "<html><head><script>" + js + "</script></head><body></body></html>",
                        "text/html", "utf-8", null);
            } catch (Throwable t) {
                Log.e(TAG, "Could not start csTimer: " + t);
                failed = true;
                ready.countDown();
            }
        });
    }

    private String readAsset() throws Exception {
        try (InputStream in = appContext.getAssets().open(ASSET)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream(700 * 1024);
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        }
    }

    /**
     * Asks csTimer for a scramble. Waits for the answer, so never call it from the main thread.
     *
     * @param type      csTimer's scramble type, for example "zbll"
     * @param caseIndex the case to build (the index in csTimer's list for that type), or -1 for a
     *                  random one
     * @return the scramble, or null if csTimer could not produce one
     */
    public String getScramble(String type, int caseIndex) {
        return getScramble(type, 0, caseIndex);
    }

    /**
     * Same as {@link #getScramble(String, int)}, with the scramble length csTimer should use. Some
     * types (8x8x8, Gear Cube, Gigaminx, ...) need a length, csTimer's own default for each is in
     * {@link CsPuzzles}.
     */
    public String getScramble(String type, int length, int caseIndex) {
        String call = "(function(){try{return cstimerModule.getScramble('" + type + "'," + Math.max(0, length) + ","
                + (caseIndex >= 0 ? String.valueOf(caseIndex) : "undefined")
                + ");}catch(e){return 'ERR:'+e;}})()";
        String scramble = evaluate(call);
        if (scramble == null || scramble.startsWith("ERR:") || scramble.trim().isEmpty()) {
            Log.e(TAG, "csTimer failed for " + type + ": " + scramble);
            return null;
        }
        return scramble.trim();
    }

    /**
     * Asks csTimer to draw a scramble. Returns an SVG document, or null if csTimer has no picture
     * for that type. Never call it from the main thread.
     */
    public String getImage(String type, String scramble) {
        if (scramble == null) return null;
        String call = "(function(){try{var r=cstimerModule.getImage(" + JSONObject.quote(scramble) + ",'" + type
                + "');return (typeof r==='string')?r:'';}catch(e){return '';}})()";
        String svg = evaluate(call);
        return svg == null || !svg.contains("<svg") ? null : svg;
    }

    /** Runs a piece of JavaScript in csTimer's WebView and waits for its string result. */
    private String evaluate(String call) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            throw new IllegalStateException("CsTimer must not be used on the main thread");
        }
        try {
            if (!ready.await(TIMEOUT_SECONDS, TimeUnit.SECONDS) || failed || web == null) return null;
            final String[] result = new String[1];
            final CountDownLatch done = new CountDownLatch(1);
            main.post(() -> web.evaluateJavascript(call, (ValueCallback<String>) value -> {
                try {
                    Object parsed = new JSONTokener(value == null ? "null" : value).nextValue();
                    result[0] = parsed == null || parsed.toString().equals("null") ? null : parsed.toString();
                } catch (Exception e) {
                    result[0] = null;
                }
                done.countDown();
            }));
            if (!done.await(TIMEOUT_SECONDS, TimeUnit.SECONDS)) return null;
            return result[0];
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }
}
