export type RailwayEventType =
  | 'train.updated'
  | 'train.dispatched'
  | 'train.held'
  | 'train.stopped'
  | 'train.rerouted'
  | 'alert.raised'
  | 'alert.acknowledged'
  | 'system.updated';

export interface RailwayEvent<TPayload = Record<string, unknown>> {
  id: string;
  type: RailwayEventType;
  occurredAt: string;
  source: string;
  payload: TPayload;
}

type EventListener = (event: RailwayEvent) => void;

export class RailwayEventBus {
  private readonly listeners = new Set<EventListener>();

  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  publish<TPayload extends Record<string, unknown>>(
    type: RailwayEventType,
    payload: TPayload,
    source = 'railway.ui',
  ): RailwayEvent<TPayload> {
    const event: RailwayEvent<TPayload> = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      occurredAt: new Date().toISOString(),
      source,
      payload,
    };
    this.listeners.forEach((listener) => listener(event));
    return event;
  }
}

export const railwayEventBus = new RailwayEventBus();
