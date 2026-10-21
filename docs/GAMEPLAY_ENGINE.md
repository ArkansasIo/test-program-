# Railway Operations Engine

The former gameplay engine is now the operational engine layer for railway workflows.

## Responsibilities

- Resolve current operational state.
- Calculate schedule variance.
- Evaluate service conflicts.
- Generate dashboard metrics.
- Coordinate page workflows.
- Validate command preconditions before API submission.
- Surface stale, degraded, and unavailable states.

## Engine Boundary

```text
UI Intent → Controller → Typed API → Server Validation → Operational State
```

The client must never be the authoritative source for movement authority, signaling safety, or security permissions.
