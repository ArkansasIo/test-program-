import express from 'express';
import { INITIAL_RAILWAY_ALERTS, INITIAL_RAILWAY_TRAINS } from '../src/railway/railwayModels';
import { INITIAL_RAILWAY_DOMAIN_STATE } from '../src/railway/railwayDomainModels';
import { railwayOperationsService } from '../src/railway/railwayService';
import { checkRailwayHealth, overallHealth } from '../src/railway/railwayHealth';
import { railwayAuditLog } from '../src/railway/railwayAudit';
import { railwayEventBus } from '../src/railway/railwayEvents';
import { selectAvailableVehicles, selectOpenWorkOrders } from '../src/railway/railwaySelectors';
import { principalFromRequest, requireRailwayPermission } from './railwayAuthMiddleware';

const requestId = () => `rail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const idParam = (value: string) => decodeURIComponent(value);

export function createRailwayServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const alerts = structuredClone(INITIAL_RAILWAY_ALERTS);
  const users = [
    { id: 'USR-001', username: 'dispatcher', role: 'dispatcher', enabled: true },
    { id: 'USR-002', username: 'safety', role: 'safety-manager', enabled: true },
    { id: 'USR-003', username: 'analyst', role: 'analyst', enabled: true },
  ];
  const trackSections = [
    { id: 'TRK-N01', name: 'North Approach', from: 'NTH', to: 'MID', state: 'available', speedLimitKph: 120 },
    { id: 'TRK-N02', name: 'North Central', from: 'MID', to: 'CEN', state: 'occupied', speedLimitKph: 100 },
    { id: 'TRK-CEN-04', name: 'Central Platform Lead', from: 'CEN-04', to: 'CEN-YARD', state: 'restricted', speedLimitKph: 40 },
  ];
  const stations = [
    { id: 'STA-NTH', name: 'North Terminal', code: 'NTH', platforms: 6, state: 'open' },
    { id: 'STA-CEN', name: 'Central Station', code: 'CEN', platforms: 12, state: 'open' },
    { id: 'STA-LKS', name: 'Lakeshore', code: 'LKS', platforms: 4, state: 'open' },
    { id: 'STA-WST', name: 'West Terminal', code: 'WST', platforms: 5, state: 'open' },
  ];
  const signals = [
    { id: 'SIG-CEN-01', name: 'Central East Home', aspect: 'proceed', controlledBy: 'IXL-CEN' },
    { id: 'SIG-CEN-04', name: 'Central Platform 4', aspect: 'caution', controlledBy: 'IXL-CEN' },
    { id: 'SIG-NTH-01', name: 'North Departure', aspect: 'stop', controlledBy: 'IXL-NTH' },
  ];
  const interlockings = [
    { id: 'IXL-CEN', name: 'Central Interlocking', state: 'normal', routesSet: 0 },
    { id: 'IXL-NTH', name: 'North Interlocking', state: 'normal', routesSet: 0 },
  ];
  const punctuality = [
    { corridor: 'North-Central', onTimePercent: 96.2, averageDelayMinutes: 1.1 },
    { corridor: 'Lakeshore-Central', onTimePercent: 92.4, averageDelayMinutes: 2.3 },
    { corridor: 'Central-West', onTimePercent: 95.7, averageDelayMinutes: 1.4 },
  ];

  const sendData = (res: express.Response, data: unknown, status = 200) => {
    res.status(status).json({ data, requestId: requestId(), timestamp: new Date().toISOString() });
  };
  const sendError = (res: express.Response, status: number, code: string, message: string) => {
    res.status(status).json({ error: { code, message }, requestId: requestId(), timestamp: new Date().toISOString() });
  };
  const audit = (req: express.Request, action: string, resourceType: string, resourceId: string, outcome: 'success' | 'denied' | 'failed' = 'success') => {
    const principal = principalFromRequest(req);
    return railwayAuditLog.record({ actorId: principal.id, action, resourceType, resourceId, outcome });
  };

  app.use((_req, res, next) => {
    res.setHeader('X-Railway-Service', 'railway-operations-control');
    next();
  });

  app.get('/api/railway/health', (_req, res) => {
    const state = railwayOperationsService.getDomainState();
    const checks = checkRailwayHealth(state);
    sendData(res, { status: overallHealth(checks), service: 'railway-operations-control', version: '1.2.0', checks });
  });

  app.get('/api/railway/trains', (req, res) => {
    const query = String(req.query.state ?? '');
    const trains = railwayOperationsService.getControlState().trains;
    sendData(res, query ? trains.filter((train) => train.state === query) : trains);
  });
  app.get('/api/railway/trains/:trainId', (req, res) => {
    const train = railwayOperationsService.getControlState().trains.find((item) => item.id === idParam(req.params.trainId));
    if (!train) return sendError(res, 404, 'TRAIN_NOT_FOUND', 'Train was not found.');
    sendData(res, train);
  });

  app.post('/api/railway/dispatch/commands', requireRailwayPermission('dispatch'), (req, res) => {
    const { trainId, command } = req.body ?? {};
    if (typeof trainId !== 'string' || !['dispatch', 'hold', 'stop', 'reroute', 'release'].includes(command)) {
      audit(req, 'dispatch', 'train', String(trainId ?? ''), 'denied');
      return sendError(res, 400, 'INVALID_COMMAND', 'trainId and a supported movement command are required.');
    }
    const effectiveCommand = command === 'release' ? 'dispatch' : command;
    try {
      const state = railwayOperationsService.command(trainId, effectiveCommand);
      audit(req, effectiveCommand, 'train', trainId);
      const eventType = effectiveCommand === 'dispatch' ? 'train.dispatched' : effectiveCommand === 'hold' ? 'train.held' : effectiveCommand === 'stop' ? 'train.stopped' : 'train.rerouted';
      railwayEventBus.publish(eventType, { trainId, actorId: principalFromRequest(req).id }, 'railway.api');
      return sendData(res, { accepted: true, state });
    } catch (error) {
      audit(req, effectiveCommand, 'train', trainId, 'failed');
      return sendError(res, 409, 'COMMAND_REJECTED', error instanceof Error ? error.message : 'Command rejected.');
    }
  });

  app.get('/api/railway/modules/:moduleId', (req, res) => {
    const moduleId = idParam(req.params.moduleId);
    sendData(res, { moduleId, state: railwayOperationsService.getControlState(), domain: railwayOperationsService.getDomainState() });
  });

  app.get('/api/railway/services', (_req, res) => sendData(res, railwayOperationsService.getDomainState().services));
  app.get('/api/railway/timetables', (_req, res) => sendData(res, railwayOperationsService.getDomainState().timetables));
  app.post('/api/railway/timetables', requireRailwayPermission('edit-timetable'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const body = req.body ?? {};
    const timetable = { id: String(body.id ?? `TT-${Date.now()}`), version: String(body.version ?? 'draft-1'), serviceDate: String(body.serviceDate ?? new Date().toISOString().slice(0, 10)), status: 'draft' as const, services: Array.isArray(body.services) ? body.services : [] };
    state.timetables.push(timetable);
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'create', 'timetable', timetable.id);
    return sendData(res, timetable, 201);
  });
  app.put('/api/railway/timetables/:id', requireRailwayPermission('edit-timetable'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const index = state.timetables.findIndex((item) => item.id === idParam(req.params.id));
    if (index < 0) return sendError(res, 404, 'TIMETABLE_NOT_FOUND', 'Timetable was not found.');
    state.timetables[index] = { ...state.timetables[index], ...req.body, status: req.body?.status ?? state.timetables[index].status };
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'update', 'timetable', state.timetables[index].id);
    return sendData(res, state.timetables[index]);
  });
  app.post('/api/railway/timetables/:id/validate', requireRailwayPermission('edit-timetable'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const timetable = state.timetables.find((item) => item.id === idParam(req.params.id));
    if (!timetable) return sendError(res, 404, 'TIMETABLE_NOT_FOUND', 'Timetable was not found.');
    timetable.status = 'validated';
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'validate', 'timetable', timetable.id);
    return sendData(res, { valid: true, timetable });
  });
  app.post('/api/railway/timetables/:id/publish', requireRailwayPermission('edit-timetable'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const timetable = state.timetables.find((item) => item.id === idParam(req.params.id));
    if (!timetable) return sendError(res, 404, 'TIMETABLE_NOT_FOUND', 'Timetable was not found.');
    if (timetable.status !== 'validated') return sendError(res, 409, 'TIMETABLE_NOT_VALIDATED', 'Timetable must be validated before publication.');
    timetable.status = 'published';
    timetable.publishedAt = new Date().toISOString();
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'publish', 'timetable', timetable.id);
    return sendData(res, timetable);
  });

  app.get('/api/railway/routes', (_req, res) => sendData(res, railwayOperationsService.getDomainState().routes));
  app.get('/api/railway/track-sections', (_req, res) => sendData(res, trackSections));
  app.get('/api/railway/stations', (_req, res) => sendData(res, stations));
  app.get('/api/railway/platforms', (_req, res) => sendData(res, railwayOperationsService.getDomainState().platforms));
  app.get('/api/railway/signals', (_req, res) => sendData(res, signals));
  app.get('/api/railway/interlockings', (_req, res) => sendData(res, interlockings));

  app.get('/api/railway/vehicles', (_req, res) => sendData(res, railwayOperationsService.getDomainState().vehicles));
  app.get('/api/railway/consists', (_req, res) => sendData(res, railwayOperationsService.getDomainState().consists));
  app.post('/api/railway/consists', requireRailwayPermission('view'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const consist = { id: String(req.body?.id ?? `CST-${Date.now()}`), serviceId: req.body?.serviceId, vehicles: Array.isArray(req.body?.vehicles) ? req.body.vehicles : [], formationStatus: 'draft' as const };
    state.consists.push(consist);
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'create', 'consist', consist.id);
    return sendData(res, consist, 201);
  });
  app.put('/api/railway/consists/:id', requireRailwayPermission('view'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const index = state.consists.findIndex((item) => item.id === idParam(req.params.id));
    if (index < 0) return sendError(res, 404, 'CONSIST_NOT_FOUND', 'Consist was not found.');
    state.consists[index] = { ...state.consists[index], ...req.body };
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'update', 'consist', state.consists[index].id);
    return sendData(res, state.consists[index]);
  });
  app.post('/api/railway/vehicles/:id/diagnostics', requireRailwayPermission('view'), (req, res) => sendData(res, { vehicleId: idParam(req.params.id), status: 'diagnostic-complete', checkedAt: new Date().toISOString(), checks: ['traction', 'brake', 'door', 'communications'] }));

  app.get('/api/railway/maintenance/work-orders', (_req, res) => sendData(res, railwayOperationsService.getDomainState().maintenance));
  app.post('/api/railway/maintenance/work-orders', requireRailwayPermission('manage-maintenance'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const workOrder = { id: String(req.body?.id ?? `WO-${Date.now()}`), assetId: String(req.body?.assetId ?? 'UNKNOWN'), assetType: req.body?.assetType ?? 'facility', priority: req.body?.priority ?? 'normal', status: 'open' as const, dueAt: String(req.body?.dueAt ?? new Date(Date.now() + 86400000).toISOString()), assignedTeam: req.body?.assignedTeam };
    state.maintenance.push(workOrder);
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'create', 'maintenance-work-order', workOrder.id);
    return sendData(res, workOrder, 201);
  });
  app.put('/api/railway/maintenance/work-orders/:id', requireRailwayPermission('manage-maintenance'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const index = state.maintenance.findIndex((item) => item.id === idParam(req.params.id));
    if (index < 0) return sendError(res, 404, 'WORK_ORDER_NOT_FOUND', 'Work order was not found.');
    state.maintenance[index] = { ...state.maintenance[index], ...req.body };
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'update', 'maintenance-work-order', state.maintenance[index].id);
    return sendData(res, state.maintenance[index]);
  });
  app.post('/api/railway/maintenance/work-orders/:id/complete', requireRailwayPermission('manage-maintenance'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const workOrder = state.maintenance.find((item) => item.id === idParam(req.params.id));
    if (!workOrder) return sendError(res, 404, 'WORK_ORDER_NOT_FOUND', 'Work order was not found.');
    workOrder.status = 'completed';
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'complete', 'maintenance-work-order', workOrder.id);
    return sendData(res, workOrder);
  });

  app.get('/api/railway/crew', (_req, res) => sendData(res, railwayOperationsService.getDomainState().crew));
  app.get('/api/railway/crew/duties', (_req, res) => sendData(res, railwayOperationsService.getDomainState().duties));
  app.post('/api/railway/crew/duties', requireRailwayPermission('manage-crew'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const duty = { id: String(req.body?.id ?? `DUTY-${Date.now()}`), crewMemberId: String(req.body?.crewMemberId ?? ''), start: String(req.body?.start ?? ''), end: String(req.body?.end ?? ''), serviceIds: Array.isArray(req.body?.serviceIds) ? req.body.serviceIds : [], status: 'draft' as const };
    state.duties.push(duty);
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'create', 'crew-duty', duty.id);
    return sendData(res, duty, 201);
  });
  app.put('/api/railway/crew/duties/:id', requireRailwayPermission('manage-crew'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const index = state.duties.findIndex((item) => item.id === idParam(req.params.id));
    if (index < 0) return sendError(res, 404, 'DUTY_NOT_FOUND', 'Crew duty was not found.');
    state.duties[index] = { ...state.duties[index], ...req.body };
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'update', 'crew-duty', state.duties[index].id);
    return sendData(res, state.duties[index]);
  });

  app.get('/api/railway/incidents', (_req, res) => sendData(res, railwayOperationsService.getDomainState().incidents));
  app.post('/api/railway/incidents', requireRailwayPermission('manage-incidents'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const incident = { id: String(req.body?.id ?? `INC-${Date.now()}`), title: String(req.body?.title ?? 'Untitled incident'), severity: req.body?.severity ?? 'info', status: 'open' as const, location: String(req.body?.location ?? 'Unknown'), openedAt: new Date().toISOString(), commander: req.body?.commander };
    state.incidents.push(incident);
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'create', 'incident', incident.id);
    railwayEventBus.publish('alert.raised', { incidentId: incident.id, severity: incident.severity }, 'railway.api');
    return sendData(res, incident, 201);
  });
  app.put('/api/railway/incidents/:id', requireRailwayPermission('manage-incidents'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const index = state.incidents.findIndex((item) => item.id === idParam(req.params.id));
    if (index < 0) return sendError(res, 404, 'INCIDENT_NOT_FOUND', 'Incident was not found.');
    state.incidents[index] = { ...state.incidents[index], ...req.body };
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'update', 'incident', state.incidents[index].id);
    return sendData(res, state.incidents[index]);
  });
  app.get('/api/railway/alerts', (_req, res) => sendData(res, alerts));
  app.post('/api/railway/alerts/:id/acknowledge', requireRailwayPermission('manage-incidents'), (req, res) => {
    const alert = alerts.find((item) => item.id === idParam(req.params.id));
    if (!alert) return sendError(res, 404, 'ALERT_NOT_FOUND', 'Alert was not found.');
    alert.acknowledged = true;
    audit(req, 'acknowledge', 'alert', alert.id);
    railwayEventBus.publish('alert.acknowledged', { alertId: alert.id }, 'railway.api');
    return sendData(res, alert);
  });

  app.get('/api/railway/analytics/kpis', (_req, res) => sendData(res, railwayOperationsService.getControlState().kpis));
  app.get('/api/railway/analytics/punctuality', (_req, res) => sendData(res, punctuality));
  app.get('/api/railway/analytics/capacity', (_req, res) => {
    const state = railwayOperationsService.getDomainState();
    sendData(res, { availableVehicles: selectAvailableVehicles(state).length, openWorkOrders: selectOpenWorkOrders(state).length, services: state.services.length, platforms: state.platforms.length, crewOnDuty: state.crew.filter((member) => member.status === 'on-duty').length });
  });
  app.get('/api/railway/analytics/reports', (_req, res) => sendData(res, [
    { id: 'RPT-OPS-DAILY', name: 'Daily Operations Summary', schedule: 'daily', format: 'json' },
    { id: 'RPT-PERF-WEEKLY', name: 'Weekly Performance Report', schedule: 'weekly', format: 'json' },
    { id: 'RPT-MAINT-BACKLOG', name: 'Maintenance Backlog', schedule: 'daily', format: 'json' },
  ]));

  app.get('/api/railway/admin/users', requireRailwayPermission('manage-users'), (_req, res) => sendData(res, users));
  app.put('/api/railway/admin/users/:id', requireRailwayPermission('manage-users'), (req, res) => {
    const user = users.find((item) => item.id === idParam(req.params.id));
    if (!user) return sendError(res, 404, 'USER_NOT_FOUND', 'User was not found.');
    Object.assign(user, req.body ?? {});
    audit(req, 'update', 'user', user.id);
    return sendData(res, user);
  });
  app.get('/api/railway/admin/audit', requireRailwayPermission('view-audit'), (req, res) => sendData(res, railwayAuditLog.query({ actorId: typeof req.query.actorId === 'string' ? req.query.actorId : undefined, resourceType: typeof req.query.resourceType === 'string' ? req.query.resourceType : undefined, resourceId: typeof req.query.resourceId === 'string' ? req.query.resourceId : undefined, since: typeof req.query.since === 'string' ? req.query.since : undefined })));
  app.get('/api/railway/admin/integrations', requireRailwayPermission('manage-integrations'), (_req, res) => sendData(res, railwayOperationsService.getDomainState().integrations));
  app.put('/api/railway/admin/integrations/:id', requireRailwayPermission('manage-integrations'), (req, res) => {
    const state = railwayOperationsService.getDomainState();
    const integration = state.integrations.find((item) => item.id === idParam(req.params.id));
    if (!integration) return sendError(res, 404, 'INTEGRATION_NOT_FOUND', 'Integration was not found.');
    Object.assign(integration, req.body ?? {});
    railwayOperationsService.replaceDomainState(state);
    audit(req, 'update', 'integration', integration.id);
    railwayEventBus.publish('system.updated', { integrationId: integration.id }, 'railway.api');
    return sendData(res, integration);
  });

  app.get('/api/railway/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    res.write(`retry: 5000\n\n`);
    const unsubscribe = railwayEventBus.subscribe((event) => res.write(`data: ${JSON.stringify(event)}\n\n`));
    req.on('close', unsubscribe);
  });

  return app;
}

if (process.env.RAILWAY_SERVER_AUTOSTART === 'true') {
  const port = Number(process.env.PORT ?? 3001);
  createRailwayServer().listen(port, () => console.log(`Railway API listening on :${port}`));
}
