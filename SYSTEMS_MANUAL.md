# Railway Operations Control Platform — Systems Manual

## 1. Control Center

The Control Center is the primary operational workspace. It provides train control, movement boards, service regulation, and the control-room log.

### Train Control
Supports authorized operational commands against selected train records. The UI must display current state, location, service, delay, data freshness, and command availability before presenting an action.

### Movement Board
Provides a chronological and route-oriented view of planned and active train movements.

### Service Regulation
Provides tools for managing service conflicts, headway disruptions, platform conflicts, short turns, holds, and other operating decisions.

### Control Room Log
Records operator actions, operational decisions, warnings, and important events.

## 2. Timetable & Service

Provides timetable creation, service patterns, headway planning, and controlled schedule publication. Published versions are immutable references; revisions create new versions.

## 3. Network Infrastructure

Provides the authoritative application view of routes, track sections, speed restrictions, possessions, engineering access, and network availability. Infrastructure state is time-stamped and source-aware.

## 4. Train Fleet

Tracks vehicles and consists, including formation, availability, defects, onboard systems, and operational readiness.

## 5. Stations & Terminals

Manages station operating state, platform occupancy, yard movements, platform assignments, and passenger-flow indicators.

## 6. Signaling & Control

Provides supervisory views for signals, interlocking state, level crossings, and safety-related events. This application must not bypass certified signaling logic.

## 7. Asset Maintenance

Maintenance workflows cover work orders, defects, inspections, asset health, maintenance windows, and completion evidence for rolling stock and infrastructure.

## 8. Crew Operations

Crew tools manage personnel assignments, duties, working-time rules, qualifications, certifications, and training status.

## 9. Safety & Emergency

Safety operations include incident command, alert management, investigations, emergency response plans, escalation, and closure workflows.

## 10. Performance Intelligence

Analytics include punctuality, delay causes, capacity, service reliability, fleet utilization, station performance, maintenance trends, and management reports.

## 11. Administration & Security

Administration covers identity and access, platform configuration, audit/security logs, and external integrations.

## 12. Common UI Controls

Every operational module can use:

- Dashboard cards
- Maps
- Tables
- Timelines
- Filters
- Search
- Entity inspectors
- Command bars
- Confirmation dialogs
- Alert panels
- Status indicators
- Audit history
- Export/report actions

## 13. Operational State Rules

State transitions must be explicit, validated, and auditable. The frontend may request a transition but the backend remains authoritative.

## 14. Safety and Cybersecurity

Operational systems require authentication, authorization, secure transport, input validation, audit logging, monitoring, least privilege, and fail-closed behavior. Real railway deployment requires applicable standards and independent safety assurance.
