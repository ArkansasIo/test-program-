import { createRailwayServer } from '../server/railwayServer';

const app = createRailwayServer();
const server = app.listen(0);
const address = server.address();
if (!address || typeof address === 'string') throw new Error('API server did not bind');

const request = (path: string, init?: RequestInit) => fetch(`http://127.0.0.1:${address.port}${path}`, init);
const headers = (role: string, user = `smoke-${role}`) => ({ 'content-type': 'application/json', 'x-railway-role': role, 'x-railway-user': user });

try {
  const health = await request('/api/railway/health');
  if (!health.ok) throw new Error(`Health endpoint failed: ${health.status}`);

  const trains = await request('/api/railway/trains');
  const trainPayload = await trains.json() as { data: unknown[] };
  if (!Array.isArray(trainPayload.data) || trainPayload.data.length === 0) throw new Error('Train endpoint returned no records');

  const deniedDispatch = await request('/api/railway/dispatch/commands', { method: 'POST', headers: headers('viewer'), body: JSON.stringify({ trainId: 'TRN-0401', command: 'hold' }) });
  if (deniedDispatch.status !== 403) throw new Error(`Viewer dispatch expected 403, received ${deniedDispatch.status}`);

  const dispatch = await request('/api/railway/dispatch/commands', { method: 'POST', headers: headers('dispatcher'), body: JSON.stringify({ trainId: 'TRN-0401', command: 'hold' }) });
  if (!dispatch.ok) throw new Error(`Dispatcher command failed: ${dispatch.status}`);

  const stations = await request('/api/railway/stations');
  if (!stations.ok) throw new Error(`Stations endpoint failed: ${stations.status}`);
  const punctuality = await request('/api/railway/analytics/punctuality');
  if (!punctuality.ok) throw new Error(`Punctuality endpoint failed: ${punctuality.status}`);

  const deniedAudit = await request('/api/railway/admin/audit');
  if (deniedAudit.status !== 403) throw new Error(`Unauthenticated audit expected 403, received ${deniedAudit.status}`);
  const audit = await request('/api/railway/admin/audit', { headers: headers('safety-manager') });
  if (!audit.ok) throw new Error(`Audit endpoint failed: ${audit.status}`);

  console.log('Railway API smoke test passed.');
} finally {
  server.close();
}
