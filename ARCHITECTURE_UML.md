# Railway Operations Platform — Architecture & UML

## 1. System Architecture

```mermaid
graph TD
  UI[Railway Web UI]
  Shell[Railway Operations Shell]
  Nav[Module / Page Navigation]
  Views[Operational Views]
  API[Typed Railway API Client]
  Backend[Railway API Services]
  Data[(Operational Data Store)]
  Events[Event / Telemetry Stream]
  IAM[Identity and Access]
  Audit[Audit Service]
  Safety[Validated Railway Control Boundary]

  UI --> Shell
  Shell --> Nav
  Shell --> Views
  Views --> API
  API --> Backend
  Backend --> Data
  Backend --> Events
  Backend --> IAM
  Backend --> Audit
  Backend --> Safety
  Events --> Views
```

## 2. Domain Model

```mermaid
classDiagram
  class Train {
    +string id
    +string serviceId
    +string status
    +string location
    +number delaySeconds
  }
  class Service {
    +string id
    +string serviceCode
    +string origin
    +string destination
    +string status
  }
  class Station {
    +string id
    +string name
    +string status
  }
  class TrackSection {
    +string id
    +string routeId
    +string status
    +number speedLimitKph
  }
  class Signal {
    +string id
    +string aspect
    +string status
  }
  class WorkOrder {
    +string id
    +string assetId
    +string priority
    +string status
  }
  class Incident {
    +string id
    +string severity
    +string status
  }
  class User {
    +string id
    +string role
  }
  class AuditEvent {
    +string id
    +string actionId
    +string outcome
  }

  Service "1" --> "0..*" Train
  Station "1" --> "0..*" Train
  TrackSection "1" --> "0..*" Train
  Signal "1" --> "0..*" TrackSection
  WorkOrder --> TrackSection
  Incident --> Train
  Incident --> Station
  User --> AuditEvent
```

## 3. Command Sequence

```mermaid
sequenceDiagram
  actor Operator
  participant UI as Railway UI
  participant API as Railway API
  participant Auth as Authorization
  participant Control as Validated Control Boundary
  participant Audit as Audit Service

  Operator->>UI: Select train and command
  UI->>API: Submit command + reason
  API->>Auth: Verify identity and permission
  Auth-->>API: Authorized / rejected
  API->>Control: Validate operational preconditions
  Control-->>API: Accepted / rejected
  API->>Audit: Record command outcome
  API-->>UI: Command result + request ID
  UI-->>Operator: Updated status
```

## 4. Module Architecture

```text
Railway Operations Shell
├── Control Center
├── Timetable & Service
├── Network Infrastructure
├── Train Fleet
├── Stations & Terminals
├── Signaling & Control
├── Asset Maintenance
├── Crew Operations
├── Safety & Emergency
├── Performance Intelligence
└── Administration & Security
```

## 5. Frontend Components

The railway workspace is composed from reusable shell, navigation, command, table, map, timeline, inspector, modal, status, and notification components. Module configuration is centralized in `src/railway/railwayModules.ts`.

## 6. Safety and Trust Boundaries

The web application is not the safety authority. The architecture deliberately places a validated control boundary between application commands and any real railway control equipment. The UI must fail closed when identity, authorization, data freshness, or control preconditions are unavailable.
