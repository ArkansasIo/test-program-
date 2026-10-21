import { createRailwayServer } from './railwayServer';

const app = createRailwayServer();
const server = app.listen(0, async () => {
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Unable to resolve test port');
  const base = `http://127.0.0.1:${address.port}`;

  const health = await fetch(`${base}/api/railway/health`);
  if (!health.ok) throw new Error(`Health endpoint failed: ${health.status}`);

  const viewerDispatch = await fetch(`${base}/api/railway/dispatch/commands`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-railway-user': 'smoke-viewer', 'x-railway-role': 'viewer' },
    body: JSON.stringify({ trainId: 'TRN-0401', command: 'hold' }),
  });
  if (viewerDispatch.status !== 403) throw new Error(`RBAC expected 403, received ${viewerDispatch.status}`);

  const dispatcher = await fetch(`${base}/api/railway/dispatch/commands`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-railway-user': 'smoke-dispatcher', 'x-railway-role': 'dispatcher' },
    body: JSON.stringify({ trainId: 'TRN-0401', command: 'hold' }),
  });
  if (!dispatcher.ok) throw new Error(`Dispatcher command failed: ${dispatcher.status}`);

  const audit = await fetch(`${base}/api/railway/admin/audit`, { headers: { 'x-railway-role': 'safety' } });
  if (!audit.ok) throw new Error(`Audit endpoint failed: ${audit.status}`);

  server.close();
  console.log('Railway API smoke test passed.');
});
