# Railway Live UI Architecture

## Purpose

The Railway Operations Platform UI is now an API-backed operator console rather than a static game-style dashboard.

## Runtime flow

```text
Railway API
   |
   +--> GET /trains --------------------+
   |                                     |
   +--> POST /dispatch/commands          v
   |                              RailwayPlatform
   +--> GET /health                       |
   |                                     +--> operator commands
   +--> GET /events <--- SSE ------------+
                                           |
                                           v
                                  live train refresh
```

## Main menu contract

The UI uses the canonical IDs exported by `src/railway/railwayModules.ts`.

- `control-center`
- `timetable-service`
- `network-infrastructure`
- `train-fleet`
- `stations-terminals`
- `signaling-systems`
- `maintenance-assets`
- `crew-operations`
- `safety-emergency`
- `performance-intelligence`
- `administration-security`

Every page uses `railway.page.<page-name>` identifiers.

## Realtime behavior

`RailwayPlatform` creates an `EventSource` against `/api/railway/events`.

When the server emits an operational event, the UI refreshes the train collection. This intentionally keeps the browser as a presentation layer while the server/domain service remains responsible for command state.

## Offline behavior

The console starts with deterministic fallback train records. If the API cannot be reached, the UI displays the last known/fallback data rather than pretending the control link is healthy.

## Command behavior

Dispatch, hold, reroute, and stop are sent to the API. The server applies authorization and domain command validation before returning the new state.

## Safety boundary

This application is an operations-management/reference platform. Its interlocking, signal, routing, and dispatch logic are simulation/reference logic and must not be treated as certified railway safety equipment or as a replacement for validated railway signaling, ATP, ETCS, CBTC, PTC, interlocking, or emergency-control systems.
