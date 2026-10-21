export interface RailwayScheduledJob {
  id: string;
  name: string;
  description: string;
  schedule: string;
  intervalSeconds: number;
  enabled: boolean;
  category: 'analytics' | 'reporting' | 'maintenance' | 'notification' | 'cleanup';
}

export const RAILWAY_SCHEDULED_JOBS: RailwayScheduledJob[] = [
  { id: 'ops-kpi-aggregation', name: 'Operations KPI Aggregation', description: 'Aggregate non-safety operational KPIs.', schedule: '*/5 * * * *', intervalSeconds: 300, enabled: true, category: 'analytics' },
  { id: 'punctuality-rollup', name: 'Punctuality Rollup', description: 'Aggregate service delay and punctuality metrics.', schedule: '*/15 * * * *', intervalSeconds: 900, enabled: true, category: 'analytics' },
  { id: 'maintenance-reminders', name: 'Maintenance Reminders', description: 'Generate reminders for approaching work-order due dates.', schedule: '0 * * * *', intervalSeconds: 3600, enabled: true, category: 'maintenance' },
  { id: 'report-delivery', name: 'Management Report Delivery', description: 'Deliver scheduled management reports.', schedule: '0 * * * *', intervalSeconds: 3600, enabled: true, category: 'reporting' },
  { id: 'notification-cleanup', name: 'Notification Cleanup', description: 'Archive expired non-critical notifications.', schedule: '0 2 * * *', intervalSeconds: 86400, enabled: true, category: 'cleanup' },
];

export function isSafetyCriticalJob(job: RailwayScheduledJob): boolean {
  return false;
}
