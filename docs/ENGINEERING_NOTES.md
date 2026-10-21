# Railway Engineering Notes

## Current Direction

The repository is transitioning from a space-strategy application into a modular railway operations platform.

## Engineering Priorities

1. Keep railway menu/page IDs stable.
2. Keep API contracts typed.
3. Separate UI state from authoritative operational state.
4. Make operational commands explicit and auditable.
5. Keep safety-critical functions behind validated boundaries.
6. Maintain responsive control-room layouts.
7. Test navigation, API failures, stale data, and command confirmation.

## Implementation Notes

The railway catalog lives in `src/railway/railwayModules.ts`. The typed client lives in `src/railway/railwayApi.ts`. Railway-specific CSS is isolated in `src/styles/railway-*.css`.
