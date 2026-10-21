import { RailwayAlert, RailwayKpis, RailwayTrain } from './railwayModels';

export interface RailwayStoreSnapshot {
  trains: RailwayTrain[];
  alerts: RailwayAlert[];
  kpis: RailwayKpis;
  updatedAt: string;
}

type Listener = (snapshot: RailwayStoreSnapshot) => void;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export class RailwayStore {
  private snapshot: RailwayStoreSnapshot;
  private readonly listeners = new Set<Listener>();

  constructor(initial: RailwayStoreSnapshot) {
    this.snapshot = clone(initial);
  }

  getSnapshot(): RailwayStoreSnapshot {
    return clone(this.snapshot);
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  update(mutator: (current: RailwayStoreSnapshot) => RailwayStoreSnapshot): void {
    this.snapshot = clone({
      ...mutator(this.getSnapshot()),
      updatedAt: new Date().toISOString(),
    });
    const next = this.getSnapshot();
    this.listeners.forEach((listener) => listener(next));
  }
}
