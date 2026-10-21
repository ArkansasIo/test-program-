package com.arkansasio.universecivilization;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

/** Mobile shell for the Railway Operations Control Platform. */
public final class MainActivity extends Activity {
    private static final int BG = Color.rgb(8, 15, 28);
    private static final int PANEL = Color.rgb(17, 30, 49);
    private static final int ACCENT = Color.rgb(58, 190, 220);
    private WebView webView;
    private ProgressBar progress;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL); root.setBackgroundColor(BG);
        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setGravity(Gravity.CENTER_VERTICAL); toolbar.setPadding(dp(10), dp(7), dp(10), dp(7)); toolbar.setBackgroundColor(PANEL);
        TextView brand = new TextView(this); brand.setText("RAILWAY OPERATIONS  //  CONTROL PLATFORM"); brand.setTextColor(ACCENT); brand.setTextSize(12); brand.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        toolbar.addView(brand, new LinearLayout.LayoutParams(0, dp(44), 1f));
        toolbar.addView(button("PLATFORM", v -> loadPlatform())); toolbar.addView(button("↻", v -> webView.reload())); toolbar.addView(button("API", v -> showApiSettings()));
        root.addView(toolbar, new LinearLayout.LayoutParams(-1, -2));
        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal); progress.setMax(100); root.addView(progress, new LinearLayout.LayoutParams(-1, dp(3)));
        webView = new WebView(this); configureWebView(); root.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1f));
        setContentView(root);
        if (state != null && webView.restoreState(state) != null) return;
        loadPlatform();
    }

    private void configureWebView() {
        webView.getSettings().setJavaScriptEnabled(true); webView.getSettings().setDomStorageEnabled(true); webView.getSettings().setAllowFileAccess(false); webView.getSettings().setAllowContentAccess(false); webView.getSettings().setSupportZoom(false);
        webView.setBackgroundColor(BG); webView.setWebViewClient(new WebViewClient());
    }

    private void loadPlatform() { webView.loadUrl(RailwayConfig.PLATFORM_URL); }

    private Button button(String text, View.OnClickListener listener) {
        Button b = new Button(this); b.setText(text); b.setTextColor(Color.WHITE); b.setTextSize(11); b.setOnClickListener(listener); b.setMinHeight(dp(40));
        GradientDrawable shape = new GradientDrawable(); shape.setColor(ACCENT); shape.setCornerRadius(dp(8)); b.setBackground(shape);
        return b;
    }

    private void showApiSettings() {
        EditText input = new EditText(this); input.setSingleLine(true); input.setHint("https://api.example.com/api/railway"); input.setText(RailwayConfig.getApiBaseUrl(this));
        new AlertDialog.Builder(this).setTitle("RAILWAY API SETTINGS").setMessage("Configure an HTTPS Railway Operations API endpoint. Database credentials are never stored in this client.").setView(input)
                .setPositiveButton("SAVE", (d, w) -> { if (!RailwayConfig.saveApiBaseUrl(this, input.getText().toString())) Toast.makeText(this, "Invalid HTTPS API URL.", Toast.LENGTH_LONG).show(); else Toast.makeText(this, "Railway API URL saved.", Toast.LENGTH_SHORT).show(); })
                .setNegativeButton("CANCEL", null).show();
    }

    @Override protected void onSaveInstanceState(Bundle state) { super.onSaveInstanceState(state); if (webView != null) webView.saveState(state); }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
}
