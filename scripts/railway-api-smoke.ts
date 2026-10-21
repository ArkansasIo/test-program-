import { createRailwayServer } from '../server/railwayServer';

const app = createRailwayServer();
const server = app.listen(0);
const address = server.address();
if (!address || typeof address === 'string') throw new Error('API server did not bind');

try {
  const base = `http://127.0.0.1:${address.port}`;
  const health = await fetch(`${base}/api/railway/health`);
  if (!health.ok) throw new Error(`Health endpoint failed: ${health.status}`);
  const trains = await fetch(`${base}/api/railway/trains`);
  const payload = await trains.json() as { data: unknown[] };
  if (!Array.isArray(payload.data) || payload.data.length === 0) throw new Error('Train endpoint returned no records');
  console.log('Railway API smoke test passed.');
} finally {
  server.close();
}
