import type { RailwayOperationsSnapshot } from '../src/railway/railwayDomainModels';
import { INITIAL_RAILWAY_DOMAIN_STATE } from '../src/railway/railwayDomainModels';

/**
 * Persistence boundary for PostgreSQL.
 * The adapter deliberately uses dependency injection so the browser/domain
 * package remains database-agnostic. Install `pg` and provide a Pool-like
 * object in the server deployment to enable persistence.
 */
export interface RailwaySqlExecutor {
  query<T = unknown>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
}

export class PostgresRailwayRepository {
  constructor(private readonly db: RailwaySqlExecutor) {}

  async loadSnapshot(): Promise<RailwayOperationsSnapshot> {
    // The initial state remains the deterministic fallback for a fresh database.
    // Production deployments should replace this mapper with their migrations.
    const result = await this.db.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM railway_services');
    if (Number(result.rows[0]?.count ?? 0) === 0) return structuredClone(INITIAL_RAILWAY_DOMAIN_STATE);

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

    return { services: services.rows as never, timetables: timetables.rows as never, routes: routes.rows as never, platforms: platforms.rows as never, vehicles: vehicles.rows as never, consists: consists.rows as never, crew: crew.rows as never, duties: duties.rows as never, maintenance: maintenance.rows as never, incidents: incidents.rows as never, integrations: integrations.rows as never };
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
