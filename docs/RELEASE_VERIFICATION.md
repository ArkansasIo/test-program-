# Railway Platform Release Verification

## Build

- [ ] `npm install` completes
- [ ] `npm run lint` passes or known issues are documented
- [ ] `npm run build` completes
- [ ] Production assets load without console errors

## Navigation

- [ ] All 11 railway menus resolve
- [ ] All 44 page IDs resolve
- [ ] Page titles match the catalog
- [ ] Back/forward navigation works

## Operations UI

- [ ] Train control loads
- [ ] Movement board loads
- [ ] Maps render
- [ ] Tables support filtering
- [ ] Timeline renders
- [ ] Inspectors open
- [ ] Commands require appropriate confirmation

## API

- [ ] Health endpoint responds
- [ ] Authentication is enforced
- [ ] Unauthorized commands are rejected
- [ ] Request IDs are displayed/logged
- [ ] Errors are handled without white screens

## Safety

- [ ] UI clearly identifies prototype/non-certified boundaries
- [ ] No browser-only state is treated as authoritative
- [ ] Audit events are generated for consequential commands

## Security

- [ ] No secrets are bundled in frontend assets
- [ ] TLS is required for production API calls
- [ ] Role permissions are tested
- [ ] Dependency and build artifacts are reviewed
