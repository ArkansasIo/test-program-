import type { RailwayTrain } from './railwayModels';

export interface RailwayTelemetrySample {
  trainId: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  speedKph: number;
  location: string;
  delayMinutes: number;
  source: 'simulator' | 'api' | 'onboard';
}

export interface RailwayTelemetryState {
  latest: Record<string, RailwayTelemetrySample>;
  history: RailwayTelemetrySample[];
}

export function createTelemetryState(): RailwayTelemetryState {
  return { latest: {}, history: [] };
}

export function ingestTelemetry(state: RailwayTelemetryState, sample: RailwayTelemetrySample): RailwayTelemetryState {
  const history = [...state.history, sample].slice(-5000);
  return { latest: { ...state.latest, [sample.trainId]: sample }, history };
}

export function seedTelemetry(trains: RailwayTrain[]): RailwayTelemetryState {
  let state = createTelemetryState();
  for (const train of trains) state = ingestTelemetry(state, { trainId: train.id, timestamp: new Date().toISOString(), speedKph: train.state === 'active' ? 78 : 0, location: train.currentLocation, delayMinutes: train.delayMinutes, source: 'simulator' });
  return state;
}
