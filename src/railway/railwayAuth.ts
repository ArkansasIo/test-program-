export type RailwayRole = 'administrator' | 'dispatcher' | 'station-controller' | 'maintenance-controller' | 'crew-controller' | 'safety-manager' | 'analyst' | 'viewer';

export type RailwayPermission = 'view' | 'dispatch' | 'edit-timetable' | 'manage-maintenance' | 'manage-crew' | 'manage-incidents' | 'manage-users' | 'view-audit' | 'manage-integrations';

const ROLE_PERMISSIONS: Record<RailwayRole, RailwayPermission[]> = {
  administrator: ['view','dispatch','edit-timetable','manage-maintenance','manage-crew','manage-incidents','manage-users','view-audit','manage-integrations'],
  dispatcher: ['view','dispatch','edit-timetable'],
  'station-controller': ['view','dispatch'],
  'maintenance-controller': ['view','manage-maintenance'],
  'crew-controller': ['view','manage-crew'],
  'safety-manager': ['view','manage-incidents','view-audit'],
  analyst: ['view'],
  viewer: ['view'],
};

export interface RailwayPrincipal { id: string; username: string; roles: RailwayRole[]; enabled: boolean; }

export function hasPermission(principal: RailwayPrincipal, permission: RailwayPermission): boolean {
  return principal.enabled && principal.roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

export function assertPermission(principal: RailwayPrincipal, permission: RailwayPermission): void {
  if (!hasPermission(principal, permission)) throw new Error(`Permission denied: ${permission}`);
}

export function permissionsFor(roles: RailwayRole[]): RailwayPermission[] {
  return [...new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role]))];
}
