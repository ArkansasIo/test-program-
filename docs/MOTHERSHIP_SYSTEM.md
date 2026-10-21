# Railway Fleet Control System

The former flagship/mothership concept is replaced by a railway fleet-control model.

## Fleet Hierarchy

```text
Fleet
├── Vehicle Registry
├── Consists
├── Service Assignments
├── Onboard Systems
├── Defects
├── Maintenance State
└── Operational Readiness
```

## Fleet Dashboard

Displays vehicle availability, active services, defects, maintenance holds, utilization, and upcoming assignments.

## Consist Designer

Builds and validates train formations against vehicle compatibility, service requirements, platform constraints, and operating rules.

## Vehicle Registry

Maintains identity, class, owner/operator, configuration, mileage, maintenance status, and lifecycle history.

## Onboard Systems

Provides an application-level view of onboard systems and telemetry. It does not bypass certified train-control equipment.
