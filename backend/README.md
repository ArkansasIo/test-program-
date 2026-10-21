# Railway Operations Backend

The `backend/` directory contains server-side configuration, database access, scheduled workers, and API support for the Railway Operations Control Platform.

## Responsibilities

- Authentication and authorization
- Railway operational data persistence
- Train/service state
- Network and station records
- Fleet and maintenance records
- Crew and qualification data
- Safety incidents and alerts
- Audit events
- Scheduled background jobs

## Recommended Data Domains

```text
users
roles
trains
services
timetables
routes
track_sections
signals
stations
platforms
vehicles
consists
crew_members
duties
maintenance_work_orders
incidents
alerts
audit_events
```

## Security

Use prepared statements, secure password hashing, TLS, role-based authorization, request validation, transaction boundaries, rate limiting, and audit logging. Database credentials must remain server-side and must never be shipped to the frontend or Android application.

## Workers

Scheduled workers may process non-safety-critical jobs such as analytics aggregation, report generation, notification delivery, maintenance reminders, and data cleanup. Safety-critical movement authority must not depend on a browser cron job.

## Production Boundary

The backend is a prototype/reference layer until independently validated for its intended railway environment.
