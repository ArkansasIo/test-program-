import type { RailwayOperationsSnapshot } from './railwayDomainModels';

export interface RailwayHealthCheck { name: string; status: 'healthy' | 'degraded' | 'offline'; detail: string; checkedAt: string; }

export function checkRailwayHealth(state: RailwayOperationsSnapshot): RailwayHealthCheck[] {
  const now = new Date().toISOString();
  return [
    { name: 'Operations API', status: 'healthy', detail: 'Application service is available.', checkedAt: now },
    { name: 'Telemetry', status: state.integrations.some((item) => item.type === 'telemetry' && item.status === 'online') ? 'healthy' : 'degraded', detail: 'Telemetry integration availability.', checkedAt: now },
    { name: 'Database', status: state.integrations.some((item) => item.type === 'database' && item.status === 'online') ? 'healthy' : 'degraded', detail: 'Persistent data integration availability.', checkedAt: now },
    { name: 'Maintenance Queue', status: state.maintenance.some((item) => item.priority === 'urgent' && item.status !== 'completed') ? 'degraded' : 'healthy', detail: 'Maintenance backlog severity.', checkedAt: now },
    { name: 'Incident Command', status: state.incidents.some((item) => item.severity === 'critical' && item.status !== 'resolved') ? 'degraded' : 'healthy', detail: 'Open critical incidents.', checkedAt: now },
  ];
}

export function overallHealth(checks: RailwayHealthCheck[]): RailwayHealthCheck['status'] {
  if (checks.some((check) => check.status === 'offline')) return 'offline';
  if (checks.some((check) => check.status === 'degraded')) return 'degraded';
  return 'healthy';
}
