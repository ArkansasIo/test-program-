package com.arkansasio.universecivilization;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;

/** Configuration for the Railway Operations mobile client. */
public final class RailwayConfig {
    private static final String PREFS = "railway_operations_config";
    private static final String KEY_API_BASE = "api_base_url";
    public static final String PLATFORM_URL = "https://arkansasio.github.io/test-program-/";
    private static final String DEFAULT_API_BASE = "";

    private RailwayConfig() {}

    public static String getApiBaseUrl(Context context) {
        return preferences(context).getString(KEY_API_BASE, DEFAULT_API_BASE).trim();
    }

    public static boolean saveApiBaseUrl(Context context, String value) {
        String normalized = value == null ? "" : value.trim();
        if (!normalized.isEmpty()) {
            Uri uri = Uri.parse(normalized);
            if (!"https".equalsIgnoreCase(uri.getScheme()) || uri.getHost() == null
                    || uri.getUserInfo() != null) return false;
            normalized = normalized.replaceAll("/+$", "");
        }
        preferences(context).edit().putString(KEY_API_BASE, normalized).apply();
        return true;
    }

    private static SharedPreferences preferences(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
