# Railway State Management

## State Domains

```text
UI State
├── selected menu/page
├── filters/search
├── modal/dialog state
└── local preferences

Operational State
├── trains
├── services
├── network
├── stations
├── fleet
├── maintenance
├── crew
└── safety

Session State
├── identity
├── permissions
├── connection
└── data freshness
```

## Principles

- Server state is authoritative.
- UI state is ephemeral unless explicitly persisted.
- Every live record has freshness metadata.
- Updates are versioned where concurrent edits are possible.
- Commands trigger refresh or event-driven reconciliation.

## Degraded Mode

When connectivity is lost, the UI must not present cached operational records as live. Read-only cached views may be labeled as stale.
