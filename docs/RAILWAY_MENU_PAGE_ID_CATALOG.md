# Railway Software Menu / Page / ID Catalog

## Naming standard

- **Menu ID:** `railway.<domain>` — stable identifier for a primary navigation menu.
- **Module ID:** `<domain-name>` — application module identifier.
- **Page ID:** `railway.page.<page-name>` — stable identifier for a page/submenu view.
- **Action ID:** `<verb>` — command identifier exposed by a page controller.
- Labels are operator-facing; IDs are machine-facing and should not be changed casually.

## Primary navigation

| Menu | Menu ID | Module ID |
|---|---|---|
| Control Center | `railway.control` | `control-center` |
| Timetable & Service | `railway.timetable` | `timetable-service` |
| Network Infrastructure | `railway.network` | `network-infrastructure` |
| Train Fleet | `railway.fleet` | `train-fleet` |
| Stations & Terminals | `railway.stations` | `stations-terminals` |
| Signaling & Control | `railway.signaling` | `signaling-systems` |
| Asset Maintenance | `railway.maintenance` | `maintenance-assets` |
| Crew Operations | `railway.crew` | `crew-operations` |
| Safety & Emergency | `railway.safety` | `safety-emergency` |
| Performance Intelligence | `railway.analytics` | `performance-intelligence` |
| Administration & Security | `railway.admin` | `administration-security` |

## Pages

### Control Center
- Train Control — `railway.page.train-control`
- Movement Board — `railway.page.movement-board`
- Service Regulation — `railway.page.service-regulation`
- Control Room Log — `railway.page.control-room-log`

### Timetable & Service
- Timetable Editor — `railway.page.timetable-editor`
- Service Patterns — `railway.page.service-patterns`
- Headway Planner — `railway.page.headway-planner`
- Schedule Publication — `railway.page.schedule-publication`

### Network Infrastructure
- Network Map — `railway.page.network-map`
- Route Library — `railway.page.route-library`
- Track Sections — `railway.page.track-sections`
- Engineering Access — `railway.page.engineering-access`

### Train Fleet
- Fleet Dashboard — `railway.page.fleet-dashboard`
- Consist Designer — `railway.page.consist-designer`
- Vehicle Registry — `railway.page.vehicle-registry`
- Onboard Systems — `railway.page.onboard-systems`

### Stations & Terminals
- Station Operations — `railway.page.station-operations`
- Platform Control — `railway.page.platform-control`
- Yard Operations — `railway.page.yard-operations`
- Passenger Flow — `railway.page.passenger-flow`

### Signaling & Control
- Signal Control — `railway.page.signal-control`
- Interlocking Control — `railway.page.interlocking-control`
- Crossing Control — `railway.page.crossing-control`
- Safety Events — `railway.page.safety-events`

### Asset Maintenance
- Maintenance Control — `railway.page.maintenance-control`
- Infrastructure Health — `railway.page.infrastructure-health`
- Fleet Maintenance — `railway.page.fleet-maintenance`
- Inspection Planner — `railway.page.inspection-planner`

### Crew Operations
- Crew Control — `railway.page.crew-control`
- Duty Planner — `railway.page.duty-planner`
- Hours & Compliance — `railway.page.hours-compliance`
- Qualification & Training — `railway.page.qualification-training`

### Safety & Emergency
- Incident Command — `railway.page.incident-command`
- Alert Center — `railway.page.alert-center`
- Investigation Center — `railway.page.investigation-center`
- Emergency Response — `railway.page.emergency-response`

### Performance Intelligence
- Operations KPIs — `railway.page.operations-kpis`
- Punctuality Analysis — `railway.page.punctuality-analysis`
- Capacity Planning — `railway.page.capacity-planning`
- Management Reports — `railway.page.management-reports`

### Administration & Security
- Identity & Access — `railway.page.identity-access`
- Platform Configuration — `railway.page.platform-configuration`
- Audit & Security Log — `railway.page.audit-security-log`
- System Integrations — `railway.page.system-integrations`

## Navigation hierarchy

```text
RAILWAY OPERATIONS SOFTWARE
├── CONTROL CENTER
│   ├── Train Control
│   ├── Movement Board
│   ├── Service Regulation
│   └── Control Room Log
├── TIMETABLE & SERVICE
│   ├── Timetable Editor
│   ├── Service Patterns
│   ├── Headway Planner
│   └── Schedule Publication
├── NETWORK INFRASTRUCTURE
│   ├── Network Map
│   ├── Route Library
│   ├── Track Sections
│   └── Engineering Access
├── TRAIN FLEET
│   ├── Fleet Dashboard
│   ├── Consist Designer
│   ├── Vehicle Registry
│   └── Onboard Systems
├── STATIONS & TERMINALS
│   ├── Station Operations
│   ├── Platform Control
│   ├── Yard Operations
│   └── Passenger Flow
├── SIGNALING & CONTROL
│   ├── Signal Control
│   ├── Interlocking Control
│   ├── Crossing Control
│   └── Safety Events
├── ASSET MAINTENANCE
│   ├── Maintenance Control
│   ├── Infrastructure Health
│   ├── Fleet Maintenance
│   └── Inspection Planner
├── CREW OPERATIONS
│   ├── Crew Control
│   ├── Duty Planner
│   ├── Hours & Compliance
│   └── Qualification & Training
├── SAFETY & EMERGENCY
│   ├── Incident Command
│   ├── Alert Center
│   ├── Investigation Center
│   └── Emergency Response
├── PERFORMANCE INTELLIGENCE
│   ├── Operations KPIs
│   ├── Punctuality Analysis
│   ├── Capacity Planning
│   └── Management Reports
└── ADMINISTRATION & SECURITY
    ├── Identity & Access
    ├── Platform Configuration
    ├── Audit & Security Log
    └── System Integrations
```
