import type { RailwayAuditEvent } from './railwayDomainModels';

export interface AuditQuery { actorId?: string; resourceType?: string; resourceId?: string; outcome?: RailwayAuditEvent['outcome']; since?: string; }

export class RailwayAuditLog {
  private readonly events: RailwayAuditEvent[] = [];

  record(event: Omit<RailwayAuditEvent, 'id' | 'occurredAt'>): RailwayAuditEvent {
    const created: RailwayAuditEvent = { ...event, id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, occurredAt: new Date().toISOString() };
    this.events.push(created);
    return created;
  }

  query(query: AuditQuery = {}): RailwayAuditEvent[] {
    return this.events.filter((event) => (!query.actorId || event.actorId === query.actorId) && (!query.resourceType || event.resourceType === query.resourceType) && (!query.resourceId || event.resourceId === query.resourceId) && (!query.outcome || event.outcome === query.outcome) && (!query.since || event.occurredAt >= query.since));
  }

  all(): RailwayAuditEvent[] { return [...this.events]; }
}

export const railwayAuditLog = new RailwayAuditLog();
