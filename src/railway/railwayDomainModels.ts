export type Id = string;
export type OperationalStatus = 'planned' | 'ready' | 'active' | 'held' | 'restricted' | 'completed' | 'cancelled';
export type Severity = 'info' | 'warning' | 'critical';

export interface RailwayService { id: Id; number: string; name: string; origin: string; destination: string; pattern: string[]; status: OperationalStatus; plannedDeparture: string; plannedArrival: string; }
export interface RailwayTimetable { id: Id; version: string; serviceDate: string; status: 'draft' | 'validated' | 'published' | 'superseded'; services: string[]; publishedAt?: string; }
export interface RailwayRoute { id: Id; name: string; origin: string; destination: string; sections: string[]; direction: 'up' | 'down' | 'bidirectional'; status: 'available' | 'restricted' | 'blocked'; }
export interface RailwayPlatform { id: Id; stationId: Id; name: string; lengthM: number; status: 'available' | 'occupied' | 'closed' | 'maintenance'; }
export interface RailwayVehicle { id: Id; fleetNumber: string; className: string; type: 'locomotive' | 'multiple-unit' | 'coach' | 'wagon' | 'maintenance'; status: 'available' | 'assigned' | 'maintenance' | 'out-of-service'; mileageKm: number; }
export interface RailwayConsist { id: Id; serviceId?: Id; vehicles: Id[]; formationStatus: 'draft' | 'validated' | 'released'; }
export interface RailwayCrewMember { id: Id; employeeNumber: string; name: string; role: 'driver' | 'conductor' | 'dispatcher' | 'controller' | 'maintenance' | 'station'; status: 'available' | 'on-duty' | 'rest' | 'unavailable'; hoursToday: number; qualificationIds: string[]; }
export interface RailwayDuty { id: Id; crewMemberId: Id; start: string; end: string; serviceIds: Id[]; status: 'draft' | 'approved' | 'active' | 'completed'; }
export interface RailwayMaintenanceWorkOrder { id: Id; assetId: Id; assetType: 'track' | 'signal' | 'station' | 'vehicle' | 'facility'; priority: 'low' | 'normal' | 'high' | 'urgent'; status: 'open' | 'assigned' | 'in-progress' | 'blocked' | 'completed'; dueAt: string; assignedTeam?: string; }
export interface RailwayIncident { id: Id; title: string; severity: Severity; status: 'open' | 'contained' | 'investigating' | 'resolved'; location: string; openedAt: string; commander?: string; }
export interface RailwayAuditEvent { id: Id; actorId: string; action: string; resourceType: string; resourceId: string; occurredAt: string; outcome: 'success' | 'denied' | 'failed'; }
export interface RailwayIntegration { id: Id; name: string; type: 'api' | 'telemetry' | 'database' | 'identity' | 'notification'; status: 'online' | 'degraded' | 'offline'; lastHeartbeatAt?: string; }

export interface RailwayOperationsSnapshot {
  services: RailwayService[];
  timetables: RailwayTimetable[];
  routes: RailwayRoute[];
  platforms: RailwayPlatform[];
  vehicles: RailwayVehicle[];
  consists: RailwayConsist[];
  crew: RailwayCrewMember[];
  duties: RailwayDuty[];
  maintenance: RailwayMaintenanceWorkOrder[];
  incidents: RailwayIncident[];
  integrations: RailwayIntegration[];
}

export const INITIAL_RAILWAY_DOMAIN_STATE: RailwayOperationsSnapshot = {
  services: [
    { id: 'SRV-401', number: '401', name: 'Northstar', origin: 'NTH', destination: 'CEN', pattern: ['NTH','MID','CEN'], status: 'active', plannedDeparture: '08:15', plannedArrival: '08:42' },
    { id: 'SRV-118', number: '118', name: 'Lakeshore', origin: 'LKS', destination: 'CEN', pattern: ['LKS','EAS','CEN'], status: 'active', plannedDeparture: '08:18', plannedArrival: '08:46' },
    { id: 'SRV-772', number: '772', name: 'Express', origin: 'CEN', destination: 'WST', pattern: ['CEN','WST'], status: 'ready', plannedDeparture: '08:51', plannedArrival: '09:22' },
  ],
  timetables: [{ id: 'TT-2026-10-20', version: 'v1', serviceDate: '2026-10-20', status: 'published', services: ['SRV-401','SRV-118','SRV-772'], publishedAt: '2026-10-19T18:00:00Z' }],
  routes: [{ id: 'RT-NTH-CEN', name: 'North Corridor', origin: 'NTH', destination: 'CEN', sections: ['TRK-N01','TRK-N02'], direction: 'bidirectional', status: 'available' }],
  platforms: [{ id: 'PL-CEN-04', stationId: 'STA-CEN', name: 'Platform 4', lengthM: 220, status: 'available' }],
  vehicles: [{ id: 'VEH-0401', fleetNumber: '401', className: 'EMU-400', type: 'multiple-unit', status: 'available', mileageKm: 482110 }],
  consists: [{ id: 'CST-0401', serviceId: 'SRV-401', vehicles: ['VEH-0401'], formationStatus: 'released' }],
  crew: [{ id: 'CREW-1001', employeeNumber: 'E1001', name: 'Operations Crew 01', role: 'driver', status: 'on-duty', hoursToday: 4.5, qualificationIds: ['QUAL-DRIVER-MAINLINE'] }],
  duties: [{ id: 'DUTY-7001', crewMemberId: 'CREW-1001', start: '07:00', end: '15:00', serviceIds: ['SRV-401'], status: 'active' }],
  maintenance: [{ id: 'WO-1001', assetId: 'TRK-CEN-04', assetType: 'track', priority: 'high', status: 'assigned', dueAt: '2026-10-21T02:00:00Z', assignedTeam: 'Infrastructure Team A' }],
  incidents: [],
  integrations: [{ id: 'INT-API', name: 'Railway Operations API', type: 'api', status: 'online', lastHeartbeatAt: new Date().toISOString() }, { id: 'INT-TELEM', name: 'Vehicle Telemetry Feed', type: 'telemetry', status: 'online', lastHeartbeatAt: new Date().toISOString() }],
};
