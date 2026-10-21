# Legacy Game-to-Railway Migration Plan

## Purpose

The repository historically contained a space-strategy application. The active product is now **Railway Operations Control Platform**.

The migration deliberately keeps historical source isolated until equivalent railway functionality exists and tests pass.

## Replacement domains

| Legacy concept | Railway replacement |
|---|---|
| Planet / colony | Station / network location |
| Fleet | Train fleet / consist |
| Shipyard | Depot / fleet maintenance |
| Galaxy map | Railway network map |
| Fleet movement | Train movement and telemetry |
| Combat event | Safety incident |
| Resource economy | Operations KPI and capacity model |
| Alliance / empire | Operator organization and RBAC domain |
| Research tree | Engineering standards and configuration |
| Expedition | Inspection / engineering access workflow |
| Battle log | Incident and operational event log |

## Migration rules

1. Railway runtime code must not import legacy game modules.
2. Legacy concepts are not renamed in place when that would hide incompatible semantics.
3. New railway implementations use original source code and public-domain/general architectural patterns rather than copying third-party project code.
4. Safety-critical functions such as interlocking, signaling, train protection, and dispatch authority remain simulation/reference functionality unless independently certified.
5. Each migrated domain requires a model, service/controller, API contract, persistence mapping, UI page, and test coverage where applicable.

## Completion target

The final active dependency graph should flow through:

`UI -> railway controller -> railway service -> repository -> API/integration`

with realtime events flowing through:

`telemetry/integration -> event bus -> realtime transport -> UI`

Legacy space-game modules should eventually become removable without changing the Railway Operations application entry point.
