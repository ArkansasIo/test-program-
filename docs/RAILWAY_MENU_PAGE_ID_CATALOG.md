# Railway Menu, Page, and ID Catalog

## Naming Standard

```text
Menu ID:    railway.<domain>
Module ID:  <domain-name>
Page ID:    railway.page.<page-name>
Action ID:  <verb>
```

## Main Menus and Pages

### 1. Control Center — `railway.control` — `control-center`
- Train Control — `railway.page.train-control`
- Movement Board — `railway.page.movement-board`
- Service Regulation — `railway.page.service-regulation`
- Control Room Log — `railway.page.control-room-log`

### 2. Timetable & Service — `railway.timetable` — `timetable-service`
- Timetable Editor — `railway.page.timetable-editor`
- Service Patterns — `railway.page.service-patterns`
- Headway Planner — `railway.page.headway-planner`
- Schedule Publication — `railway.page.schedule-publication`

### 3. Network Infrastructure — `railway.network` — `network-infrastructure`
- Network Map — `railway.page.network-map`
- Route Library — `railway.page.route-library`
- Track Sections — `railway.page.track-sections`
- Engineering Access — `railway.page.engineering-access`

### 4. Train Fleet — `railway.fleet` — `train-fleet`
- Fleet Dashboard — `railway.page.fleet-dashboard`
- Consist Designer — `railway.page.consist-designer`
- Vehicle Registry — `railway.page.vehicle-registry`
- Onboard Systems — `railway.page.onboard-systems`

### 5. Stations & Terminals — `railway.stations` — `stations-terminals`
- Station Operations — `railway.page.station-operations`
- Platform Control — `railway.page.platform-control`
- Yard Operations — `railway.page.yard-operations`
- Passenger Flow — `railway.page.passenger-flow`

### 6. Signaling & Control — `railway.signaling` — `signaling-systems`
- Signal Control — `railway.page.signal-control`
- Interlocking Control — `railway.page.interlocking-control`
- Crossing Control — `railway.page.crossing-control`
- Safety Events — `railway.page.safety-events`

### 7. Asset Maintenance — `railway.maintenance` — `maintenance-assets`
- Maintenance Control — `railway.page.maintenance-control`
- Infrastructure Health — `railway.page.infrastructure-health`
- Fleet Maintenance — `railway.page.fleet-maintenance`
- Inspection Planner — `railway.page.inspection-planner`

### 8. Crew Operations — `railway.crew` — `crew-operations`
- Crew Control — `railway.page.crew-control`
- Duty Planner — `railway.page.duty-planner`
- Hours & Compliance — `railway.page.hours-compliance`
- Qualification & Training — `railway.page.qualification-training`

### 9. Safety & Emergency — `railway.safety` — `safety-emergency`
- Incident Command — `railway.page.incident-command`
- Alert Center — `railway.page.alert-center`
- Investigation Center — `railway.page.investigation-center`
- Emergency Response — `railway.page.emergency-response`

### 10. Performance Intelligence — `railway.analytics` — `performance-intelligence`
- Operations KPIs — `railway.page.operations-kpis`
- Punctuality Analysis — `railway.page.punctuality-analysis`
- Capacity Planning — `railway.page.capacity-planning`
- Management Reports — `railway.page.management-reports`

### 11. Administration & Security — `railway.admin` — `administration-security`
- Identity & Access — `railway.page.identity-access`
- Platform Configuration — `railway.page.platform-configuration`
- Audit & Security Log — `railway.page.audit-security-log`
- System Integrations — `railway.page.system-integrations`

## Action IDs

Common actions include `dispatch`, `hold`, `stop`, `reroute`, `release`, `acknowledge`, `publish`, `cancel`, `assign`, `approve`, `close`, and `export`.

The source of truth is `src/railway/railwayModules.ts`.
