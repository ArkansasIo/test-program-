# Railway Operations GUI Specification

## Visual Model

The application uses a dark industrial control-room interface optimized for high information density without sacrificing hierarchy.

## Global Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ System / Railway / Time / Identity / Connection             │
├───────────────┬──────────────────────────────┬──────────────┤
│ Main Menu     │ Page Workspace               │ Inspector    │
│               │ Map / Table / Timeline       │ Actions      │
│ Submenu       │ KPI / Alerts / Workflow      │ Details      │
├───────────────┴──────────────────────────────┴──────────────┤
│ Events / Commands / Safety / Data Freshness                 │
└─────────────────────────────────────────────────────────────┘
```

## Navigation

Main menus use IDs such as `railway.control` and pages use `railway.page.train-control`. The UI must preserve IDs even if labels change.

## Interaction Rules

- Primary action is visually distinct.
- Destructive or consequential actions require confirmation.
- Disabled actions explain why they are unavailable.
- Stale data is explicitly marked.
- Critical alerts remain visible until acknowledged or resolved.
- Keyboard focus must remain visible.

## Standard Controls

Buttons, segmented controls, filters, search fields, data tables, maps, timelines, tabs, drawers, modal dialogs, inspectors, command bars, status chips, and event feeds.

## Responsive Layout

Desktop uses three major panes. Tablet collapses the inspector into a drawer. Mobile uses a stacked page workspace with a persistent command/status layer.

## Accessibility

Use semantic controls, keyboard navigation, readable contrast, focus states, labels for icons, and non-color-only status communication.
