# Railway Source Code Reference

## Railway Configuration

`src/railway/railwayModules.ts` — main menu, module, page, control type, and action definitions.

`src/railway/railwayApi.ts` — typed API request/response and railway command client.

## Railway UI

`src/components/railway/RailwayModuleWorkspace.tsx` — reusable module/page workspace and operational command surface.

`src/components/railway/` — railway-specific shell, platform, and control-room components.

## Styling

`src/styles/railway-control.css` — control-room visual layer.

`src/styles/railway-modules.css` — module workspace styling.

`src/styles/railway-platform.css` — platform shell styling.

`src/styles/railway-modal.css` — modal/confirmation styling.

## Application Composition

`src/App.tsx` remains the top-level React composition point. Railway functionality should be integrated through stable route/page IDs rather than duplicating page labels.

## Testing Guidance

Test module resolution, page IDs, action availability, API failure states, stale data, permission failures, and responsive layouts.
