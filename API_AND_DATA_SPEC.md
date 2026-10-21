# Railway Operations Platform — API & Data Specification

## 1. Purpose

This specification defines the canonical data model used by the railway operations UI and API. The model separates planned service, live operational state, infrastructure state, people, assets, safety events, and audit records.

## 2. Identifier Standards

```text
Menu:       railway.<domain>
Module:     <domain-name>
Page:       railway.page.<page-name>
Entity:     railway.<entity>.<id>
Action:     <verb>
Correlation: <request-id>
```

## 3. Core TypeScript Models

```ts
export type RailwayStatus =
  | 'planned' | 'ready' | 'active' | 'held' | 'delayed'
  | 'completed' | 'cancelled' | 'degraded' | 'unavailable';

export interface TrainRecord {
  id: string;
  serviceId?: string;
  runNumber?: string;
  headcode?: string;
  status: RailwayStatus;
  origin?: string;
  destination?: string;
  currentLocation?: string;
  plannedDeparture?: string;
  actualDeparture?: string;
  plannedArrival?: string;
  actualArrival?: string;
  delaySeconds?: number;
  consistId?: string;
  operator?: string;
  lastUpdated: string;
}

export interface DispatchCommand {
  trainId: string;
  command: 'dispatch' | 'hold' | 'reroute' | 'stop' | 'release';
  target?: string;
  reason?: string;
}

export interface RailwayApiResponse<T> {
  data: T;
  requestId: string;
  timestamp: string;
  warnings?: string[];
}
```

## 4. Infrastructure Entities

```ts
export interface TrackSection {
  id: string;
  routeId: string;
  name: string;
  status: RailwayStatus;
  speedLimitKph?: number;
  possession?: boolean;
  restriction?: string;
}

export interface Signal {
  id: string;
  location: string;
  aspect: 'red' | 'yellow' | 'double-yellow' | 'green' | 'unknown';
  status: 'healthy' | 'degraded' | 'failed';
}

export interface Station {
  id: string;
  name: string;
  platforms: string[];
  status: RailwayStatus;
}
```

## 5. Planning Entities

```ts
export interface Service {
  id: string;
  serviceCode: string;
  origin: string;
  destination: string;
  operatingDays: string[];
  timetableVersion: string;
  status: RailwayStatus;
}

export interface TimetableEntry {
  id: string;
  serviceId: string;
  locationId: string;
  arrival?: string;
  departure?: string;
  dwellSeconds?: number;
  platform?: string;
}
```

## 6. Maintenance and Crew

Maintenance records should include asset ID, work order, defect, priority, planned window, responsible team, safety constraints, and completion evidence. Crew records should include employee ID, role, duty, qualifications, validity dates, working-time status, and assignment history.

## 7. Safety and Audit

```ts
export interface Incident {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'contained' | 'investigating' | 'closed';
  location?: string;
  reportedAt: string;
  owner?: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actionId: string;
  targetId?: string;
  timestamp: string;
  outcome: 'accepted' | 'rejected' | 'failed';
  reason?: string;
  correlationId: string;
}
```

## 8. Data Freshness

Every live operational record should expose an update timestamp. UI components must distinguish current data from stale data and show degraded connectivity instead of presenting stale state as live.

## 9. Persistence

Browser storage is suitable for UI preferences, filters, cached non-authoritative data, and demonstration state. Authoritative train movement, signaling, safety, personnel, and asset records must be stored in a trusted backend.

## 10. Validation

API validation must reject malformed IDs, invalid state transitions, unauthorized commands, stale versions, missing reasons where required, and conflicting updates. The server remains authoritative.
