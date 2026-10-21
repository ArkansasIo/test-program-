# Researched Reference Architecture

This document records external open-source railway software patterns reviewed while completing the missing-file inventory. The project implements its own compatible abstractions rather than copying source code.

## Reference projects

### iRailops Section Controller

The iRailops project demonstrates a FastAPI operations backend, timetable/SOP ingestion, train-event simulation, delay detection, recovery recommendations, an operator dashboard and a browser track visualizer.

Reference: https://github.com/naijilnj/iRailops-section-control-system

Patterns incorporated here:
- operational event stream
- timetable validation/processing layer
- telemetry ingestion model
- operator-facing API boundary
- health/status monitoring

### Open Source Railway Designer

OSRD describes a modular railway design/simulation architecture in which infrastructure and timetable data are evaluated together, including train movement and interaction with signaling/interlocking concepts.

Reference: https://github.com/pchtsp/osrd-core

Patterns incorporated here:
- infrastructure/domain separation
- timetable engine
- explicit route/track entities
- simulation boundary

### Tellurian.Trains.Dispatch

Tellurian's dispatch library documents prototype-oriented dispatch workflows, capacity management, control points, block signals, passing loops and junctions, with state-machine-driven valid operations.

Reference: https://github.com/tellurianinteractive/Tellurian.Trains.Dispatch

Patterns incorporated here:
- command/state boundaries
- dispatch domain concepts
- block/control-point abstractions
- validation before operational transitions

### Railway management applications

Public railway management examples commonly separate authentication, train/station/schedule data, administrative functions and persistence. These patterns informed the platform's identity, audit, API and database layers.

References:
- https://github.com/snroy05/railway-management-system
- https://github.com/THMinh26/Railway-Management-System

## Missing-file inventory added

- `src/railway/railwayTelemetry.ts`
- `src/railway/railwayTimetableEngine.ts`
- `src/railway/railwayMaintenancePlanner.ts`
- `src/railway/railwayAuth.ts`
- `src/railway/railwayAudit.ts`
- `src/railway/railwayHealth.ts`
- `src/railway/railwayRealtime.ts`

## Safety boundary

These references are architectural research only. The web application remains an operations software/reference implementation. It must not be treated as certified signaling, interlocking, ATP, PTC, ETCS or CBTC equipment. Safety-critical authority requires independent engineering, verification, validation, applicable standards and certified hardware/software boundaries.
