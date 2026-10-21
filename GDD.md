# Railway Operations Control Platform — Master System Design Document

> **Status:** Living master specification  
> **Product:** Enterprise Railway Operations Software  
> **Frontend:** React + TypeScript + Vite  
> **Primary use:** Operations control, planning, monitoring, maintenance, safety, analytics, and administration

## 1. Product Vision

The Railway Operations Control Platform is a unified command-center application for managing railway services and infrastructure through one consistent operational model. The system combines live operational views, planning tools, asset records, safety workflows, analytics, and administrative controls.

The design goal is **one railway, one operational data model, many specialized workspaces**.

## 2. Design Principles

1. **Operational clarity** — critical train and infrastructure state is immediately visible.
2. **Fail-safe boundaries** — UI commands are separated from certified safety systems.
3. **Traceability** — important actions produce auditable records.
4. **Stable identifiers** — menus, pages, actions, entities, and API resources have deterministic IDs.
5. **Role-aware workflows** — dispatchers, planners, engineers, maintenance, safety, and administrators receive appropriate tools.
6. **Real-time first** — current service state is treated separately from historical and planned data.
7. **Human-in-the-loop control** — consequential actions require explicit confirmation and authorization.
8. **Modular growth** — every operational domain can evolve without redesigning the entire shell.

## 3. Main Operating Domains

| Domain | Menu ID | Primary responsibility |
|---|---|---|
| Control Center | `railway.control` | Train movement and live regulation |
| Timetable & Service | `railway.timetable` | Service planning and publication |
| Network Infrastructure | `railway.network` | Routes, track, and engineering access |
| Train Fleet | `railway.fleet` | Vehicles, consists, and onboard systems |
| Stations & Terminals | `railway.stations` | Platforms, yards, and passenger operations |
| Signaling & Control | `railway.signaling` | Signals, interlocking, crossings, events |
| Asset Maintenance | `railway.maintenance` | Fleet and infrastructure maintenance |
| Crew Operations | `railway.crew` | Rostering, duties, qualifications, compliance |
| Safety & Emergency | `railway.safety` | Incidents, alerts, investigations, response |
| Performance Intelligence | `railway.analytics` | KPIs, punctuality, capacity, reporting |
| Administration & Security | `railway.admin` | Identity, configuration, audit, integrations |

## 4. Page Model

Each operational page is identified as `railway.page.<page-name>`. The page controller exposes a predictable set of controls: status, filters, data views, actions, validation, confirmation, and audit information.

The current design contains 44 pages across the 11 domains. The authoritative catalog is maintained in `docs/RAILWAY_MENU_PAGE_ID_CATALOG.md`.

## 5. Core Operational Entities

- Train
- Service
- Run
- Timetable
- Route
- Track Section
- Signal
- Interlocking
- Level Crossing
- Station
- Platform
- Yard
- Vehicle
- Consist
- Crew Member
- Duty
- Maintenance Work Order
- Inspection
- Incident
- Alert
- Work Zone
- Schedule Publication
- User
- Role
- Audit Event

## 6. Operational State

A train record should distinguish at minimum:

```text
planned → formed → ready → dispatched → running → held
        → regulated → arrived → terminated → cancelled
```

Infrastructure entities similarly expose availability, restriction, work-zone, degraded, and unavailable states where appropriate.

## 7. Command Model

Commands are explicit actions, not arbitrary UI mutations. Example actions include:

- dispatch
- hold
- stop
- reroute
- release
- acknowledge
- confirm
- publish
- cancel
- assign
- close

Every consequential command should carry actor identity, timestamp, target entity, reason, authorization context, and correlation ID.

## 8. Safety Architecture

The platform is an operational information and supervisory layer. It must not be treated as a replacement for certified interlocking, signaling, ATP, PTC, ETCS, CBTC, or other safety-critical systems. Integration boundaries must enforce least privilege, command validation, deterministic state handling, and auditability.

## 9. UI Architecture

The primary desktop workspace is a railway control-room layout:

```text
┌────────────────────────────────────────────────────────────┐
│ Header / System Status / Identity / Time                  │
├──────────────┬──────────────────────────────┬──────────────┤
│ Main Menu    │ Operational Page             │ Inspector    │
│              │ Map / Table / Timeline       │ / Actions    │
│ Submenus     │ Filters / KPIs / Alerts      │              │
├──────────────┴──────────────────────────────┴──────────────┤
│ Command / Event / Audit / Safety Status Bar                │
└────────────────────────────────────────────────────────────┘
```

## 10. API and Integration

The typed client under `src/railway/railwayApi.ts` provides a boundary for train queries, dispatch commands, module state, and future operational resources. Production deployments should place authentication, authorization, validation, rate limiting, observability, and safety interlocks behind the API boundary.

## 11. Non-Functional Requirements

- Responsive UI
- Deterministic navigation
- Accessible keyboard operation
- Clear alarm priority semantics
- Structured logging
- Auditability
- Secure authentication and authorization
- API versioning
- Graceful offline/degraded state handling
- Automated build and release verification

## 12. Delivery Roadmap

### Phase 1 — Platform foundation
Navigation, page IDs, control-room shell, typed API client, common panels.

### Phase 2 — Operations
Train control, movement board, service regulation, network map, station operations.

### Phase 3 — Planning and assets
Timetables, fleet, maintenance, crew, engineering access.

### Phase 4 — Safety and intelligence
Incident command, alerts, investigations, KPIs, punctuality, capacity analytics.

### Phase 5 — Enterprise integration
Identity, audit, external railway systems, event streaming, production observability.
