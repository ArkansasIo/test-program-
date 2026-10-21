import { railwayEventBus, type RailwayEvent } from './railwayEvents';

export interface RailwayRealtimeOptions { url?: string; reconnectMs?: number; }

export class RailwayRealtimeClient {
  private source?: EventSource;
  private readonly listeners = new Set<(event: RailwayEvent) => void>();
  private readonly options: Required<RailwayRealtimeOptions>;

  constructor(options: RailwayRealtimeOptions = {}) {
    this.options = { url: options.url ?? '/api/railway/events', reconnectMs: options.reconnectMs ?? 3000 };
  }

  connect(): void {
    if (typeof EventSource === 'undefined' || this.source) return;
    this.source = new EventSource(this.options.url);
    this.source.onmessage = (message) => {
      try {
        const event = JSON.parse(message.data) as RailwayEvent;
        this.listeners.forEach((listener) => listener(event));
        railwayEventBus.publish(event.type, event.payload, event.source);
      } catch { /* Ignore malformed external events. */ }
    };
    this.source.onerror = () => { this.disconnect(); };
  }

  disconnect(): void { this.source?.close(); this.source = undefined; }
  subscribe(listener: (event: RailwayEvent) => void): () => void { this.listeners.add(listener); return () => this.listeners.delete(listener); }
}

export const railwayRealtime = new RailwayRealtimeClient();
