# Railway Platform Architecture

## Architecture Layers

1. **Presentation** — React railway shell, modules, pages, maps, tables, timelines, inspectors.
2. **Controller** — page workflows, command validation, local UI state.
3. **API** — typed request/response contracts and transport.
4. **Domain Services** — trains, timetable, network, fleet, stations, maintenance, crew, safety, analytics.
5. **Persistence** — authoritative operational database and audit store.
6. **Integration** — external railway systems, telemetry, identity, event streams.

## Navigation Contract

The module catalog is the single source for main menus, submenus, page titles, page IDs, controls, and action IDs.

## Runtime Modes

- Demo/local mode
- Connected operational mode
- Degraded/read-only mode
- Maintenance mode

The UI must clearly identify the active mode.

## Command Lifecycle

```text
Intent → Permission → Validation → Confirmation → API → Result → Audit → UI Refresh
```

## Reliability

Use request IDs, timeouts, retries only for safe/idempotent operations, stale-data detection, error boundaries, and explicit offline/degraded indicators.

## Safety Boundary

Railway safety authority remains external to this application layer unless a separately certified architecture is established.
