# Android Railway Operations Implementation

## Architecture

```text
Android Shell
  └── Railway Web UI / Mobile Views
          └── Typed Railway API
                  ├── Operations
                  ├── Fleet
                  ├── Stations
                  ├── Maintenance
                  ├── Crew
                  ├── Safety
                  └── Analytics
```

## Mobile Design

The mobile experience prioritizes status inspection, alerts, incident visibility, fleet/maintenance records, and approved workflows. Dense desktop dispatch controls are adapted into stacked panels and drawers.

## Acceptance Checks

1. Debug APK builds.
2. Android 10 launches successfully.
3. Railway pages render without a white screen.
4. Offline state is clearly shown.
5. API errors are surfaced safely.
6. HTTPS is enforced in production.
7. No credentials or privileged secrets are bundled.
8. Role permissions are enforced by the server.
