# Railway Server and Operations Commands

## Health

```text
GET /api/v1/health
```

## Train Queries

```text
GET /api/v1/trains
GET /api/v1/trains/{id}
```

## Dispatch Commands

```text
POST /api/v1/dispatch/commands
```

Supported application command IDs include:

```text
dispatch
hold
stop
reroute
release
```

## Administrative Operations

Administration commands must require elevated permissions and produce audit records. Never expose database or privileged service commands directly to the browser.

## Failure Handling

Return structured errors, request IDs, and safe messages. Do not expose credentials, stack traces, SQL statements, or internal security policy details to clients.
