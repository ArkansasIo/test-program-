# Railway Software UI / GUI Specification

## Design goal

The Railway Control Center is a desktop-first operational GUI for dispatchers, network controllers, rolling-stock managers, station operators, maintenance teams, signal engineers, crew planners, safety teams, analysts, and administrators.

The visual model is a professional rail operations workstation: persistent navigation on the left, an operational canvas in the center, contextual inspector on the right, and a compact system status footer.

## Application shell

```text
+--------------------------------------------------------------------------------+
| RAILWAY OPERATIONS PLATFORM | REGION | LIVE | Alerts | Layout                 |
+----------------------+---------------------------------------+-----------------+
| MAIN PROGRAM         | PAGE HEADER / COMMAND ACTIONS        | SYSTEM INSPECTOR|
|                      |                                       |                 |
| Operations Control   | Tabs                                | Selected Object |
|  - Live Dispatch     | Metrics                              | Details         |
|  - Timetable         |                                       | Route Authority |
|  - Movement Board    | +----------------+ +---------------+ | Telemetry       |
|                      | | Movement Board | | Health        | | Maintenance    |
| Network & Routes     | +----------------+ +---------------+ | Audit Trail    |
|  - Network Map       |                                       |                 |
|  - Corridors         | +-------+ +-------+ +-------+       |                 |
|  - Track Blocks      | |Cmd    | |Train  | |Work   |       |                 |
|                      | +-------+ +-------+ +-------+       |                 |
| ...                  | Timeline / timetable                  |                 |
+----------------------+---------------------------------------+-----------------+
| RAIL OPS CORE | FAIL-SAFE ENABLED | DATA SYNC | SIGNAL BUS ONLINE             |
+--------------------------------------------------------------------------------+
```

## Primary pages

1. **Operations Control**
   - Live Dispatch
   - Timetable
   - Movement Board
   - Headways
2. **Network & Routes**
   - Network Map
   - Corridors
   - Track Blocks
   - Possessions
3. **Rolling Stock**
   - Fleet Overview
   - Train Builder
   - Consists
   - Cab Signals
4. **Stations & Yards**
   - Station Board
   - Platforms
   - Yard Control
   - Passenger Flow
5. **Maintenance**
   - Work Orders
   - Track & Signals
   - Rolling Stock
   - Inspection Calendar
6. **Signals & Interlocking**
   - Signal Desk
   - Interlockings
   - Grade Crossings
   - Fail-Safe Events
7. **Crew & Resources**
   - Crew Board
   - Assignments
   - Hours & Compliance
   - Training
8. **Safety & Incidents**
   - Incident Desk
   - Alerts
   - Investigations
   - Emergency Plans
9. **Analytics & Reports**
   - KPIs
   - On-Time Performance
   - Capacity
   - Reports
10. **System Administration**
    - Users & Roles
    - Configuration
    - Audit Log
    - Integrations

## Pane architecture

Every page is composed from reusable panes:

- `PageHeader` — title, breadcrumb, context, primary actions.
- `Tabs` — sibling operational modes.
- `MetricStrip` — live KPIs.
- `DataPane` — tables and operational records.
- `MapPane` — route, track, station or network visualization.
- `CommandPane` — executable controls.
- `TimelinePane` — chronological movement/events.
- `InspectorPane` — selected object details.
- `WorkOrderPane` — maintenance queue.
- `AlertPane` — safety and operational alerts.
- `AuditPane` — immutable command history.

## Sub-pane pattern

A complex pane should use nested regions rather than creating a new page for every detail:

```text
Data Pane
  Header
    Title
    Status
    Pane actions
  Filter row
    Search
    Status
    Date
    Location
  Data table
  Selection footer
    Selected count
    Bulk actions
```

## Button hierarchy

### Primary
Actions that advance an operational workflow.

- Dispatch Command
- Route Train
- Confirm Movement
- Publish Timetable

### Secondary
Contextual or reversible operations.

- Hold Signal
- Set Headway
- Open Details
- Assign Crew

### Warning
Potentially disruptive operations.

- Speed Restriction
- Close Platform
- Place Track Possession

### Danger
Emergency or destructive controls.

- Emergency Stop
- Cancel Authority
- Lock Interlocking

### Utility
Non-operational interface controls.

- Filter
- Refresh
- Export
- Layout
- Open Inspector

## Button sub-controls

Buttons can expose a small command menu for related operations:

```text
[ Route Train v ]
      |
      +-- Set route
      +-- Recalculate route
      +-- Validate authority
      +-- Preview conflicts
```

Destructive command menus must require explicit confirmation and display affected train/route objects.

## Status model

- **GREEN / READY** — normal operation.
- **CYAN / ACTIVE** — selected/live state.
- **AMBER / CAUTION** — degraded but controlled.
- **RED / CRITICAL** — emergency, failure or blocked movement.
- **GRAY / OFFLINE** — unavailable or intentionally disabled.

## Safety UI rules

1. Emergency controls are visually isolated from routine commands.
2. Emergency Stop must never be adjacent to a normal confirmation button without separation.
3. Signal and route commands display the selected object before execution.
4. Commands are audit logged.
5. Permission state is visible before privileged commands.
6. Fail-safe state must remain readable even when panels are collapsed.

## Responsive behavior

- Desktop: three-column workstation.
- Tablet: navigation remains available; inspector becomes a drawer.
- Mobile: single-pane stack; inspector becomes a bottom sheet; critical controls remain fixed and accessible.

## Source implementation

The first reusable implementation is `src/components/RailwayControlCenter.tsx` with styles in `src/styles/railway-control.css`. It provides the page registry, subpage navigation, tabs, operational panes, metrics, command buttons, inspector, timeline region, work-order region, and responsive shell.
