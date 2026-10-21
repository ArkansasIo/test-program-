import type { RailwayOperationsSnapshot } from '../src/railway/railwayDomainModels';
import { INITIAL_RAILWAY_DOMAIN_STATE } from '../src/railway/railwayDomainModels';

/** MySQL persistence boundary matching backend/railway_schema.sql and railway_schema_v2.sql. */
export interface RailwayMysqlExecutor {
  query<T = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<[T[], unknown]>;
}

const json = <T>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value as T;
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

export class MysqlRailwayRepository {
  constructor(private readonly db: RailwayMysqlExecutor) {}

  async loadSnapshot(): Promise<RailwayOperationsSnapshot> {
    const [countRows] = await this.db.query<{ count: number }>('SELECT COUNT(*) AS count FROM railway_services');
    if (Number(countRows[0]?.count ?? 0) === 0) return structuredClone(INITIAL_RAILWAY_DOMAIN_STATE);

    const [services, timetables, routes, platforms, vehicles, consists, crew, duties, maintenance, incidents, integrations] = await Promise.all([
      this.db.query('SELECT id, service_number AS number, name, origin, destination, pattern_json, state, planned_departure, planned_arrival FROM railway_services ORDER BY id'),
      this.db.query('SELECT id, version, service_date, state, services_json, published_at FROM railway_timetables ORDER BY service_date DESC, version DESC'),
      this.db.query('SELECT id, name, origin, destination, sections_json, direction, state FROM railway_routes ORDER BY id'),
      this.db.query('SELECT id, station_id, name, length_m, state FROM railway_platforms ORDER BY id'),
      this.db.query('SELECT id, fleet_number, class_name, vehicle_type, state, mileage_km FROM railway_vehicles ORDER BY id'),
      this.db.query('SELECT id, service_id, vehicles_json, formation_state FROM railway_consists ORDER BY id'),
      this.db.query('SELECT id, employee_number, name, role, state, hours_today, qualification_ids_json FROM railway_crew_members ORDER BY id'),
      this.db.query('SELECT id, crew_member_id, start_time, end_time, services_json, state FROM railway_duties ORDER BY start_time'),
      this.db.query('SELECT id, asset_id, asset_type, priority, state, due_at, assigned_team FROM railway_maintenance_work_orders ORDER BY due_at'),
      this.db.query('SELECT id, title, severity, state, location, opened_at, commander FROM railway_incidents ORDER BY opened_at DESC'),
      this.db.query('SELECT id, name, integration_type, state, last_heartbeat_at FROM railway_integrations ORDER BY id'),
    ]);

    return {
      services: services.map((row) => ({ ...row, pattern: json(row.pattern_json, []) , pattern_json: undefined, plannedDeparture: row.planned_departure, plannedArrival: row.planned_arrival, status: row.state, planned_departure: undefined, planned_arrival: undefined, state: undefined })) as never,
      timetables: timetables.map((row) => ({ ...row, serviceDate: String(row.service_date), services: json(row.services_json, []), status: row.state, service_date: undefined, services_json: undefined, state: undefined })) as never,
      routes: routes.map((row) => ({ ...row, sections: json(row.sections_json, []), status: row.state, sections_json: undefined, state: undefined })) as never,
      platforms: platforms.map((row) => ({ ...row, stationId: row.station_id, lengthM: Number(row.length_m), status: row.state, station_id: undefined, length_m: undefined, state: undefined })) as never,
      vehicles: vehicles.map((row) => ({ ...row, fleetNumber: row.fleet_number, className: row.class_name, type: row.vehicle_type, status: row.state, mileageKm: Number(row.mileage_km), fleet_number: undefined, class_name: undefined, vehicle_type: undefined, state: undefined, mileage_km: undefined })) as never,
      consists: consists.map((row) => ({ ...row, serviceId: row.service_id ?? undefined, vehicles: json(row.vehicles_json, []), formationStatus: row.formation_state, service_id: undefined, vehicles_json: undefined, formation_state: undefined })) as never,
      crew: crew.map((row) => ({ ...row, employeeNumber: row.employee_number, status: row.state, hoursToday: Number(row.hours_today), qualificationIds: json(row.qualification_ids_json, []), employee_number: undefined, state: undefined, hours_today: undefined, qualification_ids_json: undefined })) as never,
      duties: duties.map((row) => ({ ...row, crewMemberId: row.crew_member_id, start: row.start_time, end: row.end_time, serviceIds: json(row.services_json, []), status: row.state, crew_member_id: undefined, start_time: undefined, end_time: undefined, services_json: undefined, state: undefined })) as never,
      maintenance: maintenance.map((row) => ({ ...row, assetId: row.asset_id, assetType: row.asset_type, status: row.state, dueAt: row.due_at, assignedTeam: row.assigned_team, asset_id: undefined, asset_type: undefined, state: undefined, due_at: undefined, assigned_team: undefined })) as never,
      incidents: incidents.map((row) => ({ ...row, status: row.state, openedAt: row.opened_at, opened_at: undefined, state: undefined })) as never,
      integrations: integrations.map((row) => ({ ...row, type: row.integration_type, status: row.state, lastHeartbeatAt: row.last_heartbeat_at, integration_type: undefined, state: undefined, last_heartbeat_at: undefined })) as never,
    };
  }

  async health(): Promise<boolean> {
    try { await this.db.query('SELECT 1'); return true; } catch { return false; }
  }
}
