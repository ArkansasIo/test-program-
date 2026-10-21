# Railway UI Component Architecture

## Shell

```text
RailwayPlatform
├── RailwayTopbar
├── RailwaySidebar
│   └── RailwaySubnav
├── RailwayCommandBar
├── RailwayPageWorkspace
│   ├── RailwayMapCanvas
│   ├── RailwayDataTable
│   ├── RailwayTimeline
│   ├── RailwayKpiCards
│   └── RailwayInspector
├── RailwayModal / Confirm Dialog
├── RailwayToast / Alerts
└── RailwayStatusBar
```

## Module Workspace

`RailwayModuleWorkspace` consumes the module catalog in `src/railway/railwayModules.ts`. It resolves a main menu, module, page, page ID, actions, and control type into a consistent operational workspace.

## Component Rules

- Components receive typed data.
- Operational actions expose stable action IDs.
- Dangerous actions require confirmation.
- Loading, stale, unavailable, and error states are visible.
- Components do not embed business-critical authorization logic.
- API access is isolated from presentation components.

## Control Types

`dashboard`, `map`, `table`, `timeline`, `form`, `inspector`, `chart`, `console`, `workflow`, and `settings` are the standard page control types.
