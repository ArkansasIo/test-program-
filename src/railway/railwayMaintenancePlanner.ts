import type { RailwayMaintenanceWorkOrder } from './railwayDomainModels';

export interface MaintenanceWindow { id: string; start: string; end: string; assetIds: string[]; reason: string; status: 'proposed' | 'approved' | 'active' | 'closed'; }

export function prioritizeWorkOrders(orders: RailwayMaintenanceWorkOrder[]): RailwayMaintenanceWorkOrder[] {
  const rank = { urgent: 0, high: 1, normal: 2, low: 3 } as const;
  return [...orders].sort((a, b) => rank[a.priority] - rank[b.priority] || Date.parse(a.dueAt) - Date.parse(b.dueAt));
}

export function createMaintenanceWindow(assetIds: string[], start: string, end: string, reason: string): MaintenanceWindow {
  return { id: `MW-${Date.now()}`, assetIds, start, end, reason, status: 'proposed' };
}

export function canScheduleWindow(window: MaintenanceWindow, activeAssetIds: Set<string>): boolean {
  return window.assetIds.every((assetId) => !activeAssetIds.has(assetId));
}

export function approveMaintenanceWindow(window: MaintenanceWindow): MaintenanceWindow {
  if (window.status !== 'proposed') throw new Error('Only proposed maintenance windows can be approved.');
  return { ...window, status: 'approved' };
}
