import { INITIAL_RAILWAY_DOMAIN_STATE, type RailwayOperationsSnapshot } from './railwayDomainModels';
import { createRailwayControllerState, executeRailwayCommand, type RailwayCommand, type RailwayControllerState } from './railwayController';
import { calculateKpis } from './railwaySelectors';

export class RailwayOperationsService {
  private domain: RailwayOperationsSnapshot = structuredClone(INITIAL_RAILWAY_DOMAIN_STATE);
  private control: RailwayControllerState = createRailwayControllerState();

  getDomainState(): RailwayOperationsSnapshot { return structuredClone(this.domain); }
  getControlState(): RailwayControllerState { return structuredClone(this.control); }

  command(trainId: string, command: RailwayCommand): RailwayControllerState {
    this.control = executeRailwayCommand(this.control, trainId, command);
    this.control = { ...this.control, kpis: calculateKpis(this.control.trains, this.control.kpis) };
    return this.getControlState();
  }

  replaceDomainState(next: RailwayOperationsSnapshot): void { this.domain = structuredClone(next); }
}

export const railwayOperationsService = new RailwayOperationsService();
