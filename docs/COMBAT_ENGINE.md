# Railway Movement & Regulation Engine

This document replaces the former combat-engine concept with railway movement and service-regulation logic.

## Responsibilities

- Represent planned and live train movements.
- Validate train state transitions.
- Calculate schedule variance and delay.
- Detect route, platform, headway, and service conflicts.
- Produce recommended regulation actions.
- Send authorized commands through the railway API.

## State Model

```text
planned → ready → dispatched → running → arrived → completed
                         ├→ held
                         ├→ regulated
                         └→ cancelled
```

## Regulation Inputs

- Timetable plan
- Train position/time
- Route availability
- Platform occupancy
- Speed restrictions
- Engineering possessions
- Headway targets
- Service priority

## Safety Boundary

The engine is an operational software component. It does not replace certified signaling, interlocking, ATP, PTC, ETCS, CBTC, or movement-authority systems.
