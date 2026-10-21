import { INITIAL_RAILWAY_DOMAIN_STATE, type RailwayOperationsSnapshot } from '../src/railway/railwayDomainModels';

export interface RailwayRepository {
  snapshot(): RailwayOperationsSnapshot;
  replace(snapshot: RailwayOperationsSnapshot): void;
}

export class InMemoryRailwayRepository implements RailwayRepository {
  private state: RailwayOperationsSnapshot = structuredClone(INITIAL_RAILWAY_DOMAIN_STATE);

  snapshot(): RailwayOperationsSnapshot {
    return structuredClone(this.state);
  }

  replace(snapshot: RailwayOperationsSnapshot): void {
    this.state = structuredClone(snapshot);
  }
}

export const railwayRepository = new InMemoryRailwayRepository();
