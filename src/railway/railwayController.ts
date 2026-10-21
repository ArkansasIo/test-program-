import type { RailwayAlert, RailwayKpis, RailwayTrain } from './railwayModels';
import { INITIAL_RAILWAY_ALERTS, INITIAL_RAILWAY_KPIS, INITIAL_RAILWAY_TRAINS } from './railwayModels';

export type RailwayCommand = 'dispatch' | 'hold' | 'stop' | 'reroute' | 'acknowledge';

export interface RailwayControllerState {
  trains: RailwayTrain[];
  alerts: RailwayAlert[];
  kpis: RailwayKpis;
  lastCommand: string;
}

export function createRailwayControllerState(): RailwayControllerState {
  return {
    trains: structuredClone(INITIAL_RAILWAY_TRAINS),
    alerts: structuredClone(INITIAL_RAILWAY_ALERTS),
    kpis: { ...INITIAL_RAILWAY_KPIS },
    lastCommand: 'CONTROL LINK ONLINE',
  };
}

export function executeRailwayCommand(
  state: RailwayControllerState,
  trainId: string,
  command: RailwayCommand,
): RailwayControllerState {
  const trains = state.trains.map((train) => {
    if (train.id !== trainId) return train;
    switch (command) {
      case 'dispatch': return { ...train, state: 'active' };
      case 'hold': return { ...train, state: 'held' };
      case 'stop': return { ...train, state: 'restricted' };
      case 'reroute': return { ...train, delayMinutes: train.delayMinutes + 1, currentLocation: `${train.currentLocation}-R` };
      default: return train;
    }
  });

  const alerts = command === 'acknowledge'
    ? state.alerts.map((alert) => ({ ...alert, acknowledged: true }))
    : state.alerts;

  return {
    ...state,
    trains,
    alerts,
    kpis: {
      ...state.kpis,
      activeAlerts: alerts.filter((alert) => !alert.acknowledged).length,
      activeTrains: trains.filter((train) => train.state === 'active').length,
    },
    lastCommand: `${command.toUpperCase()} ${trainId}`,
  };
}
