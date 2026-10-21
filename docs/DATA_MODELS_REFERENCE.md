# Railway Data Models Reference

## Core Entities

| Entity | Purpose | Example ID |
|---|---|---|
| Train | Live vehicle movement | `railway.train.TRN-204` |
| Service | Passenger/freight service definition | `railway.service.SVC-204` |
| Timetable | Planned movement version | `railway.timetable.W24` |
| Route | Logical operating route | `railway.route.R01` |
| Track Section | Physical infrastructure segment | `railway.track.T01` |
| Signal | Signaling asset | `railway.signal.SG-101` |
| Station | Passenger/operational location | `railway.station.CENTRAL` |
| Platform | Station platform resource | `railway.platform.CENTRAL-4` |
| Vehicle | Individual rolling-stock unit | `railway.vehicle.V-1204` |
| Consist | Operational vehicle formation | `railway.consist.C-204` |
| Crew Member | Operating employee | `railway.crew.CM-88` |
| Duty | Crew assignment | `railway.duty.D-104` |
| Work Order | Maintenance task | `railway.workorder.WO-440` |
| Incident | Safety event | `railway.incident.INC-44` |
| Alert | Operational warning | `railway.alert.A-19` |
| Audit Event | Security/command record | `railway.audit.AE-900` |

## Status Model

Common statuses are `planned`, `ready`, `active`, `held`, `delayed`, `completed`, `cancelled`, `degraded`, and `unavailable`.

## Data Rules

Every authoritative operational record should have an immutable ID, source timestamp, last-updated timestamp, version or revision, and audit metadata where appropriate.
