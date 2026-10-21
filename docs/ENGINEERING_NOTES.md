# Repository Engineering Notes

## Scope

This repository contains the Universe Civilization: Empire at War browser client, game systems, and companion/mobile scaffolding. The GitHub Pages app is a static client preview; persistent multiplayer outcomes must be validated and committed by trusted backend services.

## Current validation commands

Run from the repository root:

```sh
npm install
npm run lint
npm run engine:smoke
npm run game:command:smoke
npm run build
```

- `npm run lint` runs the TypeScript compiler without emitting files.
- `npm run engine:smoke` checks resource deltas, turn processing, and combat calculations.
- `npm run game:command:smoke` checks server-command flows, including idempotency and authorization rejection.
- `npm run build` produces the static client in `dist/`.

A successful build does not imply type-check or gameplay tests passed. Check each job's result separately.

## Continuous integration

The Pages workflow builds and deploys the static client. The Engine Tests workflow exercises deterministic rules and command handlers. Keep those concerns separate: a deploy should not bypass failed engine checks, and engine tests should not require Firebase credentials or production services.

The repository currently has no committed npm lockfile. CI installs declared dependency ranges, so install results may change over time. Commit a lockfile and switch CI to `npm ci` as a dedicated reproducibility change after generating and verifying the lockfile with the project's chosen npm version.

## Security and multiplayer boundary

- Treat all browser payloads as untrusted.
- Derive player identity and roles from verified server sessions, not request fields.
- Validate ownership and affordability before mutating state.
- Make economic commands transactional and idempotent.
- Keep secrets and privileged credentials out of the client bundle and Android package.
- Test Firestore Security Rules with the Firebase Emulator Suite before release.

## Suggested order of work

1. Make CI dependency installation reproducible with a reviewed lockfile.
2. Add required TypeScript and unit-test gates after resolving existing errors.
3. Add browser smoke tests for desktop and mobile layouts.
4. Move competitive turn, economy, fleet, and combat transitions to an authoritative backend.
5. Add release evidence: commit SHA, workflow run, test results, and deployed URL.
