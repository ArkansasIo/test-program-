import { INITIAL_RAILWAY_DOMAIN_STATE, type RailwayOperationsSnapshot } from './railwayDomainModels';
import { createRailwayControllerState, executeRailwayCommand, type RailwayCommand, type RailwayControllerState } from './railwayController';
import { calculateKpis } from './railwaySelectors';
import { railwayEventBus } from './railwayEvents';

export class RailwayOperationsService {
  private domain: RailwayOperationsSnapshot = structuredClone(INITIAL_RAILWAY_DOMAIN_STATE);
  private control: RailwayControllerState = createRailwayControllerState();

  getDomainState(): RailwayOperationsSnapshot { return structuredClone(this.domain); }
  getControlState(): RailwayControllerState { return structuredClone(this.control); }

  command(trainId: string, command: RailwayCommand): RailwayControllerState {
    const previous = this.control;
    this.control = executeRailwayCommand(this.control, trainId, command);
    this.control = { ...this.control, kpis: calculateKpis(this.control.trains, this.control.kpis) };
    const train = this.control.trains.find((item) => item.id === trainId);
    railwayEventBus.publish('train.updated', { trainId, command, state: train?.state ?? 'unknown', previousState: previous.trains.find((item) => item.id === trainId)?.state ?? 'unknown' }, 'railway.service');
    return this.getControlState();
  }

  replaceDomainState(next: RailwayOperationsSnapshot): void {
    this.domain = structuredClone(next);
    railwayEventBus.publish('system.updated', { domain: 'railway', entityCount: Object.values(next).reduce((total, value) => total + (Array.isArray(value) ? value.length : 0), 0) }, 'railway.service');
  }

  acknowledgeAlerts(): void {
    this.control = {
      ...this.control,
      alerts: this.control.alerts.map((alert) => ({ ...alert, acknowledged: true })),
      kpis: calculateKpis(this.control.trains, { ...this.control.kpis, activeAlerts: 0 }),
    };
    railwayEventBus.publish('alert.acknowledged', { acknowledgedBy: 'railway.service' }, 'railway.service');
  }
}

export const railwayOperationsService = new RailwayOperationsService();
