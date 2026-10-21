# Railway Operations Platform — Documentation

## Purpose

This document is the central technical manual for the Railway Operations Control Platform. It describes the application as enterprise railway software and replaces the former space-strategy/game terminology.

## Platform Modules

The platform is organized into 11 stable modules:

1. Control Center
2. Timetable & Service
3. Network Infrastructure
4. Train Fleet
5. Stations & Terminals
6. Signaling & Control
7. Asset Maintenance
8. Crew Operations
9. Safety & Emergency
10. Performance Intelligence
11. Administration & Security

Each module owns a set of pages and actions. The canonical IDs are maintained in `src/railway/railwayModules.ts` and documented in `docs/RAILWAY_MENU_PAGE_ID_CATALOG.md`.

## Page Anatomy

Every page should support the following concepts where applicable:

- Page identity and operational status
- Current time and data freshness
- Filters and search
- Primary data view
- Selected-entity inspector
- Valid actions
- Confirmation for consequential actions
- Alerts and validation messages
- Audit/event history

## Core Views

### Dashboard
Operational KPIs, alarms, service health, and high-level status.

### Map
Geospatial railway network with trains, stations, routes, work zones, and infrastructure state.

### Table
Sortable and filterable operational records.

### Timeline
Train movements, service plans, incidents, work windows, and other time-based events.

### Inspector
Detailed state and history for a selected train, route, asset, station, crew member, or incident.

### Workflow
Structured multi-step procedures such as incident response, schedule publication, maintenance approval, and engineering access.

## Control Model

The UI sends typed commands through the railway API boundary. A command should never silently change an operational record. Commands should be validated server-side and should return a result containing status, message, affected entities, and correlation/audit information.

## Operational Data Lifecycle

```text
Source Systems
   ↓
Ingestion / Validation
   ↓
Canonical Railway Model
   ↓
Operational State Store
   ↓
API / Event Stream
   ↓
Railway Control UI
   ↓
Authorized Command
   ↓
Validated Service / Control System
   ↓
Audit Event
```

## Security

Use role-based access control, least privilege, session protection, secure transport, input validation, audit logging, and explicit authorization for operational commands. Administrative actions must be separated from routine dispatch actions.

## Observability

The production design should expose:

- API request metrics
- command latency
- command success/failure rate
- data freshness
- event-stream health
- service availability
- authentication failures
- audit pipeline health
- client error telemetry

## Deployment

The frontend is Vite-based and can be hosted as a static application. A production railway deployment requires a trusted backend and integration layer. GitHub Pages is appropriate for demonstration and documentation, not for authoritative train-control state.

## Safety Notice

This project is a software prototype/reference architecture. It is not certified for railway safety-critical use. Real-world deployment requires applicable railway standards, independent verification and validation, cybersecurity controls, fail-safe design, operational procedures, and regulatory approval.
