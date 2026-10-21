# Railway Operations — Android Companion

The Android application is a mobile companion shell for the Railway Operations Control Platform.

## Purpose

The mobile client provides authenticated operational views, alerts, status inspection, and approved workflows. It must not bypass railway safety systems or act as an independent movement-authority system.

## Build

Requires JDK 17 and the Android SDK configured by the project.

```bash
cd android
gradle --no-daemon assembleDebug
```

## Planned Mobile Areas

- Operations dashboard
- Train status
- Alerts
- Incident status
- Station status
- Fleet inspection
- Crew notifications
- Maintenance work orders
- Performance KPIs

## API

The mobile client communicates with the same authenticated railway API contract documented in `../API_CONTRACT.md`.

## Security

- HTTPS only for production.
- No database credentials in the APK.
- Secure token storage.
- Explicit role/permission enforcement.
- Logout and token expiration support.
- No safety-critical command bypass.
