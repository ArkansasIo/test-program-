# Railway Operations Control Platform

> Enterprise railway operations software for train control, timetabling, network infrastructure, rolling stock, stations, signaling, maintenance, crew operations, safety, analytics, and system administration.

## Overview

This repository is a web-based railway operations platform built with React, TypeScript, Vite, and a modular API architecture. It is designed as a unified control-room application rather than a game client.

The platform provides a common operational workspace for dispatchers, controllers, planners, engineers, maintenance teams, station operators, safety teams, analysts, and administrators.

## Operating Domains

1. **Control Center** — live train control, movement boards, service regulation, and control-room logs.
2. **Timetable & Service** — timetable editing, service patterns, headway planning, and schedule publication.
3. **Network Infrastructure** — network maps, route libraries, track sections, and engineering access.
4. **Train Fleet** — fleet monitoring, consist design, vehicle registry, and onboard systems.
5. **Stations & Terminals** — station operations, platform control, yard operations, and passenger flow.
6. **Signaling & Control** — signals, interlocking, crossings, and safety events.
7. **Asset Maintenance** — maintenance control, infrastructure health, fleet maintenance, and inspections.
8. **Crew Operations** — crew control, duty planning, hours/compliance, and qualification/training.
9. **Safety & Emergency** — incident command, alerts, investigations, and emergency response.
10. **Performance Intelligence** — operations KPIs, punctuality, capacity planning, and management reporting.
11. **Administration & Security** — identity/access, configuration, audit/security, and integrations.

## Navigation and IDs

The application uses stable identifiers for automation, routing, permissions, testing, and API integration:

```text
Menu ID:    railway.<domain>
Module ID:  <domain-name>
Page ID:    railway.page.<page-name>
Action ID:  <verb>
```

The current navigation catalog contains **11 main menus and 44 operational pages**. See `docs/RAILWAY_MENU_PAGE_ID_CATALOG.md`.

## Platform Architecture

```text
Railway Web UI
    │
    ├── Command Center Shell
    ├── Module Navigation
    ├── Page Controllers
    ├── Maps / Tables / Timelines / Inspectors
    └── Alerts / Workflows / Audit UI
             │
             ▼
       Railway API Layer
             │
    ┌────────┼─────────┐
    ▼        ▼         ▼
 Operations Data   Identity   Integration Services
    │
    ├── Trains
    ├── Services
    ├── Infrastructure
    ├── Stations
    ├── Signals
    ├── Maintenance
    ├── Crew
    └── Safety
```

## Technology

- React + TypeScript
- Vite
- Tailwind CSS and application-specific railway control-room CSS
- Lucide React icons
- Typed railway API client
- Responsive desktop/tablet/mobile layouts
- GitHub Pages-compatible frontend deployment
- Optional backend services under `backend/`
- Android wrapper under `android/`

## Development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm run build
```

A successful deployment should not be interpreted as a substitute for local type checking and operational testing.

## Documentation

### Core
- [Systems Manual](SYSTEMS_MANUAL.md)
- [Platform Documentation](DOCUMENTATION.md)
- [API and Data Specification](API_AND_DATA_SPEC.md)
- [API Contract](API_CONTRACT.md)
- [Architecture UML](ARCHITECTURE_UML.md)
- [Engineering Changelog](CHANGELOG.md)

### Railway Architecture
- [Railway Platform Architecture](docs/RAILWAY_PLATFORM_ARCHITECTURE.md)
- [Railway UI / GUI Specification](docs/RAILWAY_UI_GUI_SPEC.md)
- [Railway Menu / Page / ID Catalog](docs/RAILWAY_MENU_PAGE_ID_CATALOG.md)
- [Component Architecture](docs/COMPONENTS_ARCHITECTURE.md)
- [Data Models](docs/DATA_MODELS_REFERENCE.md)
- [State Management](docs/STATE_MANAGEMENT_AND_ENGINE.md)
- [Source Code Reference](docs/SOURCE_CODE_REFERENCE.md)
- [UML Diagrams](docs/UML_DIAGRAMS.md)
- [Engineering Roadmap](docs/ENGINEERING_ROADMAP.md)
- [Release Verification](docs/RELEASE_VERIFICATION.md)

## Source Layout

```text
src/
  components/railway/     Railway shell, workspace, modules, controls
  railway/                Navigation definitions and typed API client
  components/             Shared application views
  styles/                 Railway and application UI styling
  App.tsx                 Application composition and route selection
backend/                  Backend and database scaffolding
android/                  Android application wrapper
docs/                     Railway engineering documentation
.github/workflows/        CI, Pages, and Android workflows
```

## Safety Boundary

This software is a planning, monitoring, visualization, and control-system prototype. It does not by itself provide certified railway signaling, interlocking, positive train control, automatic train protection, or safety-critical authorization. Any deployment affecting real railway movement must use independently validated, certified, fail-safe systems and appropriate operational procedures.

## Status

The repository is being migrated from its original space-strategy application into a railway operations software platform. Railway navigation, IDs, UI architecture, typed API contracts, and control-room components are being implemented incrementally.
