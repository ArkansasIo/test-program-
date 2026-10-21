# Railway API Route Catalog

Base path: `/api/railway`.

## Core

- `GET /health`
- `GET /trains`
- `GET /trains/:trainId`
- `POST /dispatch/commands`
- `GET /modules/:moduleId`

## Timetable & Service

- `GET /services`
- `GET /timetables`
- `POST /timetables`
- `PUT /timetables/:id`
- `POST /timetables/:id/validate`
- `POST /timetables/:id/publish`

## Network

- `GET /routes`
- `GET /track-sections`
- `GET /stations`
- `GET /platforms`
- `GET /signals`
- `GET /interlockings`

## Fleet

- `GET /vehicles`
- `GET /consists`
- `POST /consists`
- `PUT /consists/:id`
- `POST /vehicles/:id/diagnostics`

## Maintenance

- `GET /maintenance/work-orders`
- `POST /maintenance/work-orders`
- `PUT /maintenance/work-orders/:id`
- `POST /maintenance/work-orders/:id/complete`

## Crew

- `GET /crew`
- `GET /crew/duties`
- `POST /crew/duties`
- `PUT /crew/duties/:id`

## Safety

- `GET /incidents`
- `POST /incidents`
- `PUT /incidents/:id`
- `GET /alerts`
- `POST /alerts/:id/acknowledge`

## Analytics

- `GET /analytics/kpis`
- `GET /analytics/punctuality`
- `GET /analytics/capacity`
- `GET /analytics/reports`

## Administration

- `GET /admin/users`
- `PUT /admin/users/:id`
- `GET /admin/audit`
- `GET /admin/integrations`
- `PUT /admin/integrations/:id`

Movement authority, signal/interlocking commands, and other safety-critical functions must remain behind independently validated railway control boundaries. The web application is an operations interface/reference implementation, not a certified signaling or train-protection system.
