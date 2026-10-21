# Railway Operations Security Specification

## Security Principles

1. Authenticate every private operation.
2. Authorize every resource and command.
3. Use least privilege by role.
4. Treat operational state as untrusted until validated by the server.
5. Protect audit records from unauthorized modification.
6. Never ship secrets in frontend or Android builds.
7. Fail closed when identity, authorization, freshness, or required safety conditions cannot be established.

## Railway Roles

- Dispatcher
- Controller
- Planner
- Station Operator
- Fleet Manager
- Maintenance Engineer
- Crew Manager
- Safety Officer
- Analyst
- Administrator

## Adversarial Test Cases

1. Unauthenticated train read → reject.
2. Unauthorized train command → reject.
3. Cross-role privilege escalation → reject.
4. Command for unknown train → reject.
5. Stale train version → reject or require refresh.
6. Invalid state transition → reject.
7. Missing command reason where required → reject.
8. Cross-tenant asset access → reject.
9. Audit record modification → reject.
10. Invalid timetable publication → reject.
11. Oversized or malformed request → reject.
12. Credential/secret exposure attempt → prevent and log.

## Audit Requirements

Consequential commands must record actor, action ID, target, timestamp, result, reason, and correlation ID.
