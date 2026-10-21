# Railway Operations Backend Setup

## Architecture

```text
Railway React UI
      |
      v
RailwayApiClient
      |
      v
Express Railway API
      |
      +--> RBAC middleware
      +--> Operations Service
      +--> Audit Event Log
      +--> Railway Event Bus / SSE
      |
      v
MySQL repository adapter
      |
      v
railway_schema.sql + railway_schema_v2.sql
```

## Development mode

The API starts with deterministic in-memory domain data and does not require a database:

```bash
npm run railway:api
```

The default server port is `3001`. Set `PORT` to override it.

## API smoke test

```bash
npm run railway:api-smoke
```

The smoke test validates health, train retrieval, RBAC denial, dispatcher command authorization, station retrieval, punctuality analytics, and audit authorization.

## MySQL mode

The repository contains two schema files:

1. `backend/railway_schema.sql` — core operational tables.
2. `backend/railway_schema_v2.sql` — service, timetable, route, platform, consist, duty and integration tables plus crew qualification storage.

Apply both schemas to the same MySQL database. The application can then inject a `mysql2`-compatible executor into `MysqlRailwayRepository`.

The repository adapter intentionally does not create its own database connection. This keeps credentials and connection pooling outside the domain package.

## RBAC headers

The reference API accepts these development headers:

```text
X-Railway-User: dispatcher-01
X-Railway-Username: dispatcher
X-Railway-Role: dispatcher
```

Supported roles are defined by `src/railway/railwayAuth.ts`:

- administrator
- dispatcher
- station-controller
- maintenance-controller
- crew-controller
- safety-manager
- analyst
- viewer

This header-based mechanism is a development/reference authentication boundary. Production deployments should replace it with an independently managed identity provider and verified authentication tokens.

## Safety boundary

This software is an operations interface/reference implementation. It must not be treated as a certified interlocking, movement-authority, train-protection, ATP/PTC/ETCS/CBTC, or safety-critical signaling controller. Safety-critical commands require independently validated railway control boundaries.
