import type { RailwayOperationsSnapshot } from '../src/railway/railwayDomainModels';
import { INITIAL_RAILWAY_DOMAIN_STATE } from '../src/railway/railwayDomainModels';

/**
 * MySQL persistence boundary matching backend/railway_schema.sql.
 * A mysql2 Pool, connection, or compatible executor can be injected by the
 * deployment layer; the domain package remains database-agnostic.
 */
export interface RailwayMysqlExecutor {
  query<T = unknown>(sql: string, values?: unknown[]): Promise<[T[], unknown]>;
}

export class MysqlRailwayRepository {
  constructor(private readonly db: RailwayMysqlExecutor) {}

  async loadSnapshot(): Promise<RailwayOperationsSnapshot> {
    const [countRows] = await this.db.query<{ count: number }>('SELECT COUNT(*) AS count FROM railway_services');
    if (Number(countRows[0]?.count ?? 0) === 0) return structuredClone(INITIAL_RAILWAY_DOMAIN_STATE);

    const [services, timetables, routes, platforms, vehicles, consists, crew, duties, maintenance, incidents, integrations] = await Promise.all([
      this.db.query('SELECT * FROM railway_services ORDER BY id'),
      this.db.query('SELECT * FROM railway_timetables ORDER BY service_date DESC, version DESC'),
      this.db.query('SELECT * FROM railway_routes ORDER BY id'),
      this.db.query('SELECT * FROM railway_platforms ORDER BY id'),
      this.db.query('SELECT * FROM railway_vehicles ORDER BY id'),
      this.db.query('SELECT * FROM railway_consists ORDER BY id'),
      this.db.query('SELECT * FROM railway_crew_members ORDER BY id'),
      this.db.query('SELECT * FROM railway_duties ORDER BY start_time'),
      this.db.query('SELECT * FROM railway_maintenance_work_orders ORDER BY due_at'),
      this.db.query('SELECT * FROM railway_incidents ORDER BY opened_at DESC'),
      this.db.query('SELECT * FROM railway_integrations ORDER BY id'),
    ]);

    return {
      services: services[0] as never,
      timetables: timetables[0] as never,
      routes: routes[0] as never,
      platforms: platforms[0] as never,
      vehicles: vehicles[0] as never,
      consists: consists[0] as never,
      crew: crew[0] as never,
      duties: duties[0] as never,
      maintenance: maintenance[0] as never,
      incidents: incidents[0] as never,
      integrations: integrations[0] as never,
    };
  }

  async health(): Promise<boolean> {
    try {
      await this.db.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
