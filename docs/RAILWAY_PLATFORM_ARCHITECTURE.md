# Railway Platform Architecture

## Platform layers

```text
Railway Operations Platform
├── Presentation
│   ├── Platform Shell
│   ├── Module Rail
│   ├── Submodule Pane
│   ├── Command Bar
│   ├── Data Table
│   ├── Network Map
│   ├── Timeline
│   ├── Inspector
│   └── Status Bar
├── Controllers
│   ├── Module Controller
│   ├── Command Controller
│   ├── Selection Controller
│   ├── Inspector Controller
│   └── Notification Controller
├── Domain Modules
│   ├── Operations Control
│   ├── Network & Routes
│   ├── Rolling Stock
│   ├── Stations & Yards
│   ├── Maintenance
│   ├── Signals & Interlocking
│   ├── Crew & Resources
│   ├── Safety & Incidents
│   ├── Analytics & Reports
│   └── System Administration
└── API
    ├── Train API
    ├── Dispatch API
    ├── Module State API
    ├── Network API
    ├── Incident API
    ├── Maintenance API
    └── Administration API
```

## GUI controller behavior

The platform uses a three-to-four pane desktop layout:

1. **Module rail** — major operational domains.
2. **Submodule pane** — pages and controllers belonging to the selected domain.
3. **Workspace** — maps, tables, timelines, forms, workflows, charts, or consoles.
4. **Inspector** — selected train, block, signal, station, work order, or incident.

The layout collapses to a two-pane and then single-pane mobile layout at smaller widths.

## Safety-oriented command model

Dispatch controls are explicit actions rather than passive links:

- Dispatch
- Hold
- Reroute
- Stop
- Release
- Workflow
- Open Detail

Production integrations should add authorization, interlocking validation, audit logging, command idempotency, operator identity, and server-side safety checks before executing real railway commands.

## API contract

Base URL:

```text
/api/railway
```

Core endpoints:

```text
GET    /trains
GET    /trains/:trainId
GET    /modules/:moduleId
POST   /dispatch/commands
```

The frontend API client normalizes responses into:

```ts
{
  ok: boolean;
  data?: T;
  error?: { code: string; message: string };
  requestId: string;
  timestamp: string;
}
```

## Module registry

The canonical module registry is `src/railway/railwayModules.ts`. It is the source of truth for module IDs, submodule IDs, descriptions, control types, and available actions.

## Frontend entry point

The railway platform can be opened from the main command deck using **RAILWAY CONTROL**. This keeps the railway system available without replacing the existing universe command navigation.
