import express from 'express';
import { railwayOperationsService } from '../src/railway/railwayService';
import { checkRailwayHealth, overallHealth } from '../src/railway/railwayHealth';
import { railwayAuditLog } from '../src/railway/railwayAudit';
import { railwayEventBus } from '../src/railway/railwayEvents';
import { selectAvailableVehicles, selectOpenWorkOrders } from '../src/railway/railwaySelectors';

export function createRailwayServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/railway/health', (_req, res) => {
    const state = railwayOperationsService.getDomainState();
    const checks = checkRailwayHealth(state);
    res.json({ data: { status: overallHealth(checks), service: 'railway-operations-control', checks } });
  });
  app.get('/api/railway/trains', (_req, res) => res.json({ data: railwayOperationsService.getControlState().trains }));
  app.get('/api/railway/services', (_req, res) => res.json({ data: railwayOperationsService.getDomainState().services }));
  app.get('/api/railway/timetables', (_req, res) => res.json({ data: railwayOperationsService.getDomainState().timetables }));
  app.get('/api/railway/routes', (_req, res) => res.json({ data: railwayOperationsService.getDomainState().routes }));
  app.get('/api/railway/vehicles', (_req, res) => res.json({ data: railwayOperationsService.getDomainState().vehicles }));
  app.get('/api/railway/maintenance/work-orders', (_req, res) => res.json({ data: railwayOperationsService.getDomainState().maintenance }));
  app.get('/api/railway/incidents', (_req, res) => res.json({ data: railwayOperationsService.getDomainState().incidents }));
  app.get('/api/railway/admin/audit', (_req, res) => res.json({ data: railwayAuditLog.all() }));
  app.get('/api/railway/analytics/kpis', (_req, res) => res.json({ data: railwayOperationsService.getControlState().kpis }));
  app.get('/api/railway/analytics/capacity', (_req, res) => {
    const state = railwayOperationsService.getDomainState();
    res.json({ data: { availableVehicles: selectAvailableVehicles(state).length, openWorkOrders: selectOpenWorkOrders(state).length, services: state.services.length } });
  });

  app.post('/api/railway/dispatch/commands', (req, res) => {
    const { trainId, command } = req.body ?? {};
    if (typeof trainId !== 'string' || !['dispatch', 'hold', 'stop', 'reroute'].includes(command)) {
      res.status(400).json({ error: { code: 'INVALID_COMMAND', message: 'trainId and a supported movement command are required' } });
      return;
    }
    const state = railwayOperationsService.command(trainId, command);
    railwayAuditLog.record({ actorId: 'api-user', action: command, resourceType: 'train', resourceId: trainId, outcome: 'success' });
    const eventType = command === 'dispatch' ? 'train.dispatched' : command === 'hold' ? 'train.held' : command === 'stop' ? 'train.stopped' : 'train.rerouted';
    railwayEventBus.publish(eventType, { trainId }, 'railway.api');
    res.json({ data: { accepted: true, state } });
  });

  app.get('/api/railway/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    const unsubscribe = railwayEventBus.subscribe((event) => res.write(`data: ${JSON.stringify(event)}\n\n`));
    req.on('close', unsubscribe);
  });

  return app;
}

if (process.env.RAILWAY_SERVER_AUTOSTART === 'true') {
  const port = Number(process.env.PORT ?? 3001);
  createRailwayServer().listen(port, () => console.log(`Railway API listening on :${port}`));
}
