export type RailwayOperationalState = 'planned' | 'ready' | 'active' | 'held' | 'restricted' | 'completed' | 'cancelled';

export interface RailwayTrain {
  id: string;
  serviceId: string;
  serviceName: string;
  origin: string;
  destination: string;
  currentLocation: string;
  state: RailwayOperationalState;
  delayMinutes: number;
  nextEvent: string;
}

export interface RailwayTrackSection {
  id: string;
  name: string;
  from: string;
  to: string;
  state: 'available' | 'occupied' | 'restricted' | 'blocked';
  speedLimitKph: number;
}

export interface RailwayStation {
  id: string;
  name: string;
  code: string;
  platforms: number;
  state: 'open' | 'restricted' | 'closed';
}

export interface RailwaySignal {
  id: string;
  name: string;
  aspect: 'stop' | 'caution' | 'proceed' | 'dark';
  controlledBy: string;
}

export interface RailwayAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  acknowledged: boolean;
}

export interface RailwayKpis {
  activeTrains: number;
  onTimePercent: number;
  restrictedSections: number;
  activeAlerts: number;
  availableFleet: number;
  crewOnDuty: number;
}

export const INITIAL_RAILWAY_TRAINS: RailwayTrain[] = [
  { id: 'TRN-0401', serviceId: 'SRV-401', serviceName: 'Northstar', origin: 'NTH', destination: 'CEN', currentLocation: 'CEN-04', state: 'active', delayMinutes: 0, nextEvent: '08:42' },
  { id: 'TRN-0118', serviceId: 'SRV-118', serviceName: 'Lakeshore', origin: 'LKS', destination: 'CEN', currentLocation: 'LKS-02', state: 'active', delayMinutes: 2, nextEvent: '08:46' },
  { id: 'TRN-0772', serviceId: 'SRV-772', serviceName: 'Express', origin: 'CEN', destination: 'WST', currentLocation: 'CEN-01', state: 'ready', delayMinutes: 0, nextEvent: '08:51' },
  { id: 'TRN-0221', serviceId: 'SRV-221', serviceName: 'Regional', origin: 'CEN', destination: 'STH', currentLocation: 'CEN-04', state: 'ready', delayMinutes: 0, nextEvent: '09:03' },
];

export const INITIAL_RAILWAY_KPIS: RailwayKpis = {
  activeTrains: 42,
  onTimePercent: 94.8,
  restrictedSections: 6,
  activeAlerts: 2,
  availableFleet: 118,
  crewOnDuty: 164,
};

export const INITIAL_RAILWAY_ALERTS: RailwayAlert[] = [
  { id: 'ALT-001', severity: 'warning', title: 'Track restriction', message: 'Temporary speed restriction on CEN-04.', acknowledged: false },
  { id: 'ALT-002', severity: 'info', title: 'Service recovery', message: 'Lakeshore service is two minutes late.', acknowledged: false },
];
