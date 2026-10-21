export type RailwayControlType =
  | 'dashboard' | 'map' | 'table' | 'timeline' | 'form' | 'inspector'
  | 'chart' | 'console' | 'workflow' | 'settings';

export interface RailwaySubModule {
  id: string;
  label: string;
  description: string;
  control: RailwayControlType;
  actions: string[];
}

export interface RailwayModule {
  id: string;
  label: string;
  icon: string;
  description: string;
  subModules: RailwaySubModule[];
}

export const RAILWAY_MODULES: RailwayModule[] = [
  { id: 'operations', label: 'Operations Control', icon: 'activity', description: 'Real-time railway operations and dispatch.', subModules: [
    { id: 'live-dispatch', label: 'Live Dispatch', description: 'Monitor and control active train movements.', control: 'dashboard', actions: ['Dispatch', 'Hold', 'Reroute', 'Acknowledge'] },
    { id: 'movement-board', label: 'Movement Board', description: 'Track trains, blocks, routes and headways.', control: 'table', actions: ['Filter', 'Focus', 'Export'] },
    { id: 'timetable', label: 'Timetable', description: 'Scheduled services and operating windows.', control: 'timeline', actions: ['Create', 'Edit', 'Publish', 'Archive'] },
    { id: 'headways', label: 'Headway Manager', description: 'Service spacing and capacity controls.', control: 'chart', actions: ['Analyze', 'Optimize', 'Apply'] },
  ] },
  { id: 'network', label: 'Network & Routes', icon: 'map', description: 'Infrastructure, corridors and routing.', subModules: [
    { id: 'network-map', label: 'Network Map', description: 'Interactive railway topology.', control: 'map', actions: ['Zoom', 'Layers', 'Locate', 'Measure'] },
    { id: 'corridors', label: 'Corridors', description: 'Manage operating corridors.', control: 'table', actions: ['Create', 'Edit', 'Close'] },
    { id: 'track-blocks', label: 'Track Blocks', description: 'Block occupancy and availability.', control: 'dashboard', actions: ['Lock', 'Release', 'Inspect'] },
    { id: 'possessions', label: 'Possessions', description: 'Engineering possessions and closures.', control: 'workflow', actions: ['Plan', 'Approve', 'Activate', 'Close'] },
  ] },
  { id: 'rolling-stock', label: 'Rolling Stock', icon: 'train', description: 'Fleet and consist management.', subModules: [
    { id: 'fleet-overview', label: 'Fleet Overview', description: 'Fleet availability and health.', control: 'dashboard', actions: ['Inspect', 'Assign', 'Retire'] },
    { id: 'train-builder', label: 'Train Builder', description: 'Compose and configure consists.', control: 'form', actions: ['Add Car', 'Remove Car', 'Validate', 'Save'] },
    { id: 'consists', label: 'Consists', description: 'Active and planned train formations.', control: 'table', actions: ['Open', 'Duplicate', 'Assign'] },
    { id: 'cab-signals', label: 'Cab Signaling', description: 'Train protection and onboard systems.', control: 'inspector', actions: ['Test', 'Reset', 'Diagnose'] },
  ] },
  { id: 'stations', label: 'Stations & Yards', icon: 'building', description: 'Passenger stations, platforms and yards.', subModules: [
    { id: 'station-board', label: 'Station Board', description: 'Arrivals, departures and platform state.', control: 'dashboard', actions: ['Platform', 'Hold', 'Announce'] },
    { id: 'platforms', label: 'Platforms', description: 'Platform assignments and occupancy.', control: 'table', actions: ['Assign', 'Swap', 'Close'] },
    { id: 'yard-control', label: 'Yard Control', description: 'Shunting, storage and movements.', control: 'console', actions: ['Route', 'Shunt', 'Hold', 'Release'] },
    { id: 'passenger-flow', label: 'Passenger Flow', description: 'Crowding and station throughput.', control: 'chart', actions: ['Analyze', 'Alert', 'Export'] },
  ] },
  { id: 'maintenance', label: 'Maintenance', icon: 'wrench', description: 'Assets, inspections and work orders.', subModules: [
    { id: 'work-orders', label: 'Work Orders', description: 'Maintenance jobs and priorities.', control: 'table', actions: ['Create', 'Assign', 'Start', 'Complete'] },
    { id: 'track-signals', label: 'Track & Signals', description: 'Infrastructure maintenance.', control: 'inspector', actions: ['Inspect', 'Schedule', 'Report'] },
    { id: 'rolling-maintenance', label: 'Rolling Stock Maintenance', description: 'Vehicle maintenance schedules.', control: 'timeline', actions: ['Schedule', 'Defer', 'Complete'] },
    { id: 'inspection-calendar', label: 'Inspection Calendar', description: 'Recurring inspection planning.', control: 'timeline', actions: ['Create', 'Reschedule', 'Complete'] },
  ] },
  { id: 'signals', label: 'Signals & Interlocking', icon: 'signal', description: 'Signaling, interlocking and crossings.', subModules: [
    { id: 'signal-desk', label: 'Signal Desk', description: 'Signal state and route commands.', control: 'console', actions: ['Set Route', 'Clear', 'Stop', 'Acknowledge'] },
    { id: 'interlockings', label: 'Interlockings', description: 'Interlocking state and diagnostics.', control: 'inspector', actions: ['Inspect', 'Test', 'Reset'] },
    { id: 'grade-crossings', label: 'Grade Crossings', description: 'Crossing status and warnings.', control: 'dashboard', actions: ['Test', 'Block', 'Clear'] },
    { id: 'fail-safe', label: 'Fail-Safe Events', description: 'Safety events and protective states.', control: 'timeline', actions: ['Acknowledge', 'Escalate', 'Resolve'] },
  ] },
  { id: 'crew', label: 'Crew & Resources', icon: 'users', description: 'Crew assignments and qualifications.', subModules: [
    { id: 'crew-board', label: 'Crew Board', description: 'Crew availability and assignments.', control: 'table', actions: ['Assign', 'Relieve', 'Call'] },
    { id: 'assignments', label: 'Assignments', description: 'Duty and train assignments.', control: 'workflow', actions: ['Create', 'Approve', 'Swap'] },
    { id: 'compliance', label: 'Hours & Compliance', description: 'Duty hours and qualification controls.', control: 'dashboard', actions: ['Review', 'Alert', 'Export'] },
    { id: 'training', label: 'Training', description: 'Qualification and training programs.', control: 'timeline', actions: ['Enroll', 'Schedule', 'Complete'] },
  ] },
  { id: 'safety', label: 'Safety & Incidents', icon: 'shield', description: 'Incident response and safety management.', subModules: [
    { id: 'incident-desk', label: 'Incident Desk', description: 'Active incidents and response.', control: 'console', actions: ['Open', 'Escalate', 'Dispatch', 'Close'] },
    { id: 'alerts', label: 'Alerts', description: 'Operational and safety alerts.', control: 'dashboard', actions: ['Acknowledge', 'Mute', 'Escalate'] },
    { id: 'investigations', label: 'Investigations', description: 'Incident investigation workflow.', control: 'workflow', actions: ['Open', 'Assign', 'Review', 'Close'] },
    { id: 'emergency-plans', label: 'Emergency Plans', description: 'Prepared response procedures.', control: 'workflow', actions: ['Activate', 'Drill', 'Review'] },
  ] },
  { id: 'analytics', label: 'Analytics & Reports', icon: 'chart', description: 'Performance, capacity and reporting.', subModules: [
    { id: 'kpis', label: 'KPIs', description: 'Operational performance indicators.', control: 'chart', actions: ['Filter', 'Compare', 'Export'] },
    { id: 'otp', label: 'On-Time Performance', description: 'Schedule adherence and delay analysis.', control: 'chart', actions: ['Analyze', 'Compare', 'Export'] },
    { id: 'capacity', label: 'Capacity', description: 'Network and station capacity.', control: 'chart', actions: ['Model', 'Simulate', 'Export'] },
    { id: 'reports', label: 'Reports', description: 'Operational reporting center.', control: 'table', actions: ['Generate', 'Schedule', 'Download'] },
  ] },
  { id: 'administration', label: 'System Administration', icon: 'settings', description: 'Users, configuration, audit and integrations.', subModules: [
    { id: 'users-roles', label: 'Users & Roles', description: 'Identity and access control.', control: 'table', actions: ['Create', 'Edit', 'Disable', 'Audit'] },
    { id: 'configuration', label: 'Configuration', description: 'System-wide configuration.', control: 'settings', actions: ['Edit', 'Validate', 'Apply'] },
    { id: 'audit-log', label: 'Audit Log', description: 'Administrative activity history.', control: 'table', actions: ['Filter', 'Inspect', 'Export'] },
    { id: 'integrations', label: 'Integrations', description: 'External systems and APIs.', control: 'inspector', actions: ['Test', 'Configure', 'Rotate', 'Disable'] },
  ] },
];

export const RAILWAY_MODULE_MAP = Object.fromEntries(RAILWAY_MODULES.map((module) => [module.id, module]));
export const RAILWAY_SUBMODULE_MAP = Object.fromEntries(
  RAILWAY_MODULES.flatMap((module) => module.subModules.map((subModule) => [subModule.id, { module, subModule }]))
);
