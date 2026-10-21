# Railway Operations API Contract

This contract defines the HTTP API boundary for the Railway Operations Control Platform. Endpoints are examples of the platform contract and do not imply that every production service is deployed.

## Conventions

- Base URL: `https://<api-host>/api/v1`
- Content type: `application/json`
- Private endpoints require an access token.
- All writes require authentication and authorization.
- Every consequential command returns a correlation/request ID.
- Production integrations must use TLS and secure credential storage.

## Core Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | API health and version |
| GET | `/trains` | Current train records |
| GET | `/trains/{id}` | Train detail |
| POST | `/dispatch/commands` | Submit authorized train command |
| GET | `/services` | Published services |
| GET | `/timetables/{id}` | Timetable version |
| GET | `/network/map` | Network and infrastructure state |
| GET | `/stations` | Station and platform state |
| GET | `/fleet` | Fleet and vehicle state |
| GET | `/maintenance/work-orders` | Maintenance workload |
| GET | `/crew/duties` | Crew duty state |
| GET | `/incidents` | Safety incidents |
| GET | `/analytics/kpis` | Operations KPIs |
| GET | `/audit/events` | Authorized audit history |

## Command Request

```json
{
  "trainId": "TRN-204",
  "command": "hold",
  "target": "STN-CENTRAL",
  "reason": "Platform conflict"
}
```

## Command Response

```json
{
  "data": {
    "accepted": true,
    "trainId": "TRN-204",
    "command": "hold"
  },
  "requestId": "req-01HXYZ",
  "timestamp": "2026-10-20T20:00:00Z"
}
```

## Error Contract

```json
{
  "error": {
    "code": "COMMAND_REJECTED",
    "message": "The requested state transition is not permitted.",
    "requestId": "req-01HXYZ"
  }
}
```

## Authorization

Use role-based access control and resource-level authorization. A dispatcher may receive train-control permissions without receiving administration, personnel, or security permissions. Elevated commands require explicit policy checks.

## Safety Boundary

The API is an application integration boundary. Safety-critical movement authority must remain under the appropriate certified railway control architecture. The API must fail closed when authorization, data freshness, or safety preconditions cannot be established.
