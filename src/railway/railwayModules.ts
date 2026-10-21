export type RailwayControlType =
  | 'dashboard'
  | 'map'
  | 'table'
  | 'timeline'
  | 'form'
  | 'inspector'
  | 'chart'
  | 'console'
  | 'workflow'
  | 'settings';

export interface RailwayPageAction {
  id: string;
  label: string;
  description: string;
}

export interface RailwaySubModule {
  id: string;
  label: string;
  pageId: string;
  pageTitle: string;
  description: string;
  control: RailwayControlType;
  actions: RailwayPageAction[];
}

export interface RailwayModule {
  id: string;
  label: string;
  menuId: string;
  menuTitle: string;
  icon: string;
  description: string;
  subModules: RailwaySubModule[];
}

const action = (id: string, label: string, description: string): RailwayPageAction => ({ id, label, description });
const page = (
  id: string,
  label: string,
  description: string,
  control: RailwayControlType,
  actions: RailwayPageAction[],
): RailwaySubModule => ({
  id,
  label,
  pageId: `railway.page.${id}`,
  pageTitle: label,
  description,
  control,
  actions,
});

export const RAILWAY_MODULES: RailwayModule[] = [
  {
    id: 'control-center',
    label: 'Control Center',
    menuId: 'railway.control',
    menuTitle: 'CONTROL CENTER',
    icon: 'activity',
    description: 'Central command for train movements, service regulation and network control.',
    subModules: [
      page('train-control', 'Train Control', 'Real-time control of active train movements and operating commands.', 'dashboard', [action('dispatch', 'Dispatch', 'Release a train into service.'), action('hold', 'Hold', 'Place a train under operational hold.'), action('stop', 'Stop', 'Issue a controlled stop command.'), action('acknowledge', 'Acknowledge', 'Acknowledge the active control event.')]),
      page('movement-board', 'Movement Board', 'Live train movements, locations, routes and operating states.', 'table', [action('filter', 'Filter', 'Filter the movement board.'), action('focus', 'Focus', 'Focus on a selected service.'), action('export', 'Export', 'Export movement data.')]),
      page('service-regulation', 'Service Regulation', 'Regulate service intervals, recovery plans and operational priorities.', 'workflow', [action('regulate', 'Regulate', 'Apply service regulation.'), action('recover', 'Recover', 'Start recovery planning.'), action('publish', 'Publish', 'Publish the active regulation plan.')]),
      page('control-room-log', 'Control Room Log', 'Chronological operator log for control-room decisions and events.', 'timeline', [action('add-entry', 'Add Entry', 'Record an operator log entry.'), action('review', 'Review', 'Review recent control events.'), action('export', 'Export', 'Export the control-room log.')]),
    ],
  },
  {
    id: 'timetable-service',
    label: 'Timetable & Service',
    menuId: 'railway.timetable',
    menuTitle: 'TIMETABLE & SERVICE',
    icon: 'calendar',
    description: 'Timetable planning, service patterns, headways and schedule publication.',
    subModules: [
      page('timetable-editor', 'Timetable Editor', 'Create and maintain working and published timetables.', 'timeline', [action('create', 'Create', 'Create a timetable.'), action('edit', 'Edit', 'Edit the selected timetable.'), action('validate', 'Validate', 'Validate timetable conflicts.'), action('publish', 'Publish', 'Publish the validated timetable.')]),
      page('service-patterns', 'Service Patterns', 'Manage stopping patterns, service families and operating calendars.', 'table', [action('create', 'Create', 'Create a service pattern.'), action('clone', 'Clone', 'Clone an existing pattern.'), action('validate', 'Validate', 'Validate the service pattern.')]),
      page('headway-planner', 'Headway Planner', 'Plan train spacing and service frequency by corridor.', 'chart', [action('analyze', 'Analyze', 'Analyze current headways.'), action('optimize', 'Optimize', 'Calculate an improved pattern.'), action('apply', 'Apply', 'Apply the selected headway plan.')]),
      page('schedule-publication', 'Schedule Publication', 'Approve, version and publish operating schedules.', 'workflow', [action('review', 'Review', 'Review a schedule package.'), action('approve', 'Approve', 'Approve the publication package.'), action('publish', 'Publish', 'Publish the schedule.')]),
    ],
  },
  {
    id: 'network-infrastructure',
    label: 'Network Infrastructure',
    menuId: 'railway.network',
    menuTitle: 'NETWORK INFRASTRUCTURE',
    icon: 'map',
    description: 'Rail topology, routes, track sections, assets and infrastructure access.',
    subModules: [
      page('network-map', 'Network Map', 'Interactive topology map for the complete railway network.', 'map', [action('layers', 'Layers', 'Manage infrastructure map layers.'), action('locate', 'Locate', 'Locate a network asset.'), action('measure', 'Measure', 'Measure network distance.'), action('inspect', 'Inspect', 'Inspect the selected asset.')]),
      page('route-library', 'Route Library', 'Define train routes, route variants and operating paths.', 'table', [action('create', 'Create', 'Create a route.'), action('edit', 'Edit', 'Edit a route.'), action('validate', 'Validate', 'Validate route conflicts.')]),
      page('track-sections', 'Track Sections', 'Track sections, occupancy zones and availability states.', 'dashboard', [action('lock', 'Lock', 'Lock a track section.'), action('release', 'Release', 'Release a track section.'), action('inspect', 'Inspect', 'Inspect section state.')]),
      page('engineering-access', 'Engineering Access', 'Plan infrastructure possessions, closures and work windows.', 'workflow', [action('plan', 'Plan', 'Create an access plan.'), action('approve', 'Approve', 'Approve the access window.'), action('activate', 'Activate', 'Activate the possession.'), action('close', 'Close', 'Close the possession.')]),
    ],
  },
  {
    id: 'train-fleet',
    label: 'Train Fleet',
    menuId: 'railway.fleet',
    menuTitle: 'TRAIN FLEET',
    icon: 'train',
    description: 'Rolling stock, train formations, vehicle health and onboard systems.',
    subModules: [
      page('fleet-dashboard', 'Fleet Dashboard', 'Fleet availability, location, readiness and health.', 'dashboard', [action('inspect', 'Inspect', 'Inspect fleet status.'), action('assign', 'Assign', 'Assign rolling stock to service.'), action('withdraw', 'Withdraw', 'Withdraw a vehicle from service.')]),
      page('consist-designer', 'Consist Designer', 'Build and validate passenger and freight train formations.', 'form', [action('add-vehicle', 'Add Vehicle', 'Add a vehicle to the consist.'), action('remove-vehicle', 'Remove Vehicle', 'Remove a vehicle.'), action('validate', 'Validate', 'Validate the formation.'), action('save', 'Save', 'Save the consist.')]),
      page('vehicle-registry', 'Vehicle Registry', 'Master registry for locomotives, coaches, multiple units and equipment.', 'table', [action('open', 'Open', 'Open a vehicle record.'), action('edit', 'Edit', 'Edit vehicle data.'), action('assign', 'Assign', 'Assign a vehicle.')]),
      page('onboard-systems', 'Onboard Systems', 'Train protection, cab signaling and onboard diagnostic state.', 'inspector', [action('test', 'Test', 'Run a system test.'), action('diagnose', 'Diagnose', 'Run diagnostics.'), action('reset', 'Reset', 'Reset an eligible subsystem.')]),
    ],
  },
  {
    id: 'stations-terminals',
    label: 'Stations & Terminals',
    menuId: 'railway.stations',
    menuTitle: 'STATIONS & TERMINALS',
    icon: 'building',
    description: 'Station operations, platforms, yards, passenger flow and terminal resources.',
    subModules: [
      page('station-operations', 'Station Operations', 'Arrivals, departures, platforms and station operating state.', 'dashboard', [action('assign-platform', 'Assign Platform', 'Assign a platform to a service.'), action('hold-service', 'Hold Service', 'Hold a service at the station.'), action('announce', 'Announce', 'Publish a passenger announcement.')]),
      page('platform-control', 'Platform Control', 'Platform assignments, occupancy and closures.', 'table', [action('assign', 'Assign', 'Assign a platform.'), action('swap', 'Swap', 'Swap platform assignments.'), action('close', 'Close', 'Close a platform.')]),
      page('yard-operations', 'Yard Operations', 'Shunting, storage tracks, yard routes and terminal movements.', 'console', [action('route', 'Route', 'Set a yard route.'), action('shunt', 'Shunt', 'Issue a shunting movement.'), action('hold', 'Hold', 'Hold a yard movement.'), action('release', 'Release', 'Release a yard movement.')]),
      page('passenger-flow', 'Passenger Flow', 'Monitor station demand, crowding and passenger throughput.', 'chart', [action('analyze', 'Analyze', 'Analyze passenger flow.'), action('alert', 'Alert', 'Raise a crowding alert.'), action('export', 'Export', 'Export passenger-flow data.')]),
    ],
  },
  {
    id: 'signaling-systems',
    label: 'Signaling & Control',
    menuId: 'railway.signaling',
    menuTitle: 'SIGNALING & CONTROL',
    icon: 'signal',
    description: 'Signals, interlockings, crossings, train protection and fail-safe states.',
    subModules: [
      page('signal-control', 'Signal Control', 'Signal aspects, route commands and signal-state supervision.', 'console', [action('set-route', 'Set Route', 'Request a protected route.'), action('clear', 'Clear', 'Clear an eligible signal.'), action('stop', 'Stop', 'Place a signal in stop state.'), action('acknowledge', 'Acknowledge', 'Acknowledge the signal event.')]),
      page('interlocking-control', 'Interlocking Control', 'Interlocking states, route locking and diagnostic information.', 'inspector', [action('inspect', 'Inspect', 'Inspect interlocking state.'), action('test', 'Test', 'Run a diagnostic test.'), action('reset', 'Reset', 'Reset an approved subsystem.')]),
      page('crossing-control', 'Crossing Control', 'Grade crossing status, warnings and protective equipment.', 'dashboard', [action('test', 'Test', 'Test crossing equipment.'), action('block', 'Block', 'Place crossing in protected state.'), action('clear', 'Clear', 'Clear the protective state.')]),
      page('safety-events', 'Safety Events', 'Fail-safe events, protective states and safety acknowledgements.', 'timeline', [action('acknowledge', 'Acknowledge', 'Acknowledge a safety event.'), action('escalate', 'Escalate', 'Escalate the event.'), action('resolve', 'Resolve', 'Resolve an eligible event.')]),
    ],
  },
  {
    id: 'maintenance-assets',
    label: 'Asset Maintenance',
    menuId: 'railway.maintenance',
    menuTitle: 'ASSET MAINTENANCE',
    icon: 'wrench',
    description: 'Maintenance planning for track, signaling, stations, rolling stock and facilities.',
    subModules: [
      page('maintenance-control', 'Maintenance Control', 'Central maintenance backlog, priorities and work execution.', 'table', [action('create', 'Create', 'Create a work order.'), action('assign', 'Assign', 'Assign a maintenance team.'), action('start', 'Start', 'Start work.'), action('complete', 'Complete', 'Complete the work order.')]),
      page('infrastructure-health', 'Infrastructure Health', 'Condition monitoring for track, structures, signals and power assets.', 'inspector', [action('inspect', 'Inspect', 'Inspect asset health.'), action('schedule', 'Schedule', 'Schedule maintenance.'), action('report', 'Report', 'Create a condition report.')]),
      page('fleet-maintenance', 'Fleet Maintenance', 'Vehicle maintenance plans, defects and release-to-service state.', 'timeline', [action('schedule', 'Schedule', 'Schedule vehicle maintenance.'), action('defer', 'Defer', 'Defer eligible maintenance.'), action('complete', 'Complete', 'Complete maintenance.')]),
      page('inspection-planner', 'Inspection Planner', 'Recurring inspection programs, due dates and compliance.', 'timeline', [action('create', 'Create', 'Create an inspection.'), action('reschedule', 'Reschedule', 'Reschedule an inspection.'), action('complete', 'Complete', 'Complete an inspection.')]),
    ],
  },
  {
    id: 'crew-operations',
    label: 'Crew Operations',
    menuId: 'railway.crew',
    menuTitle: 'CREW OPERATIONS',
    icon: 'users',
    description: 'Crew planning, assignments, qualifications, duty hours and training.',
    subModules: [
      page('crew-control', 'Crew Control', 'Live crew availability, sign-on status and operational assignments.', 'table', [action('assign', 'Assign', 'Assign crew to service.'), action('relieve', 'Relieve', 'Relieve a crew assignment.'), action('call', 'Call', 'Call an available crew member.')]),
      page('duty-planner', 'Duty Planner', 'Create and approve crew duties and service diagrams.', 'workflow', [action('create', 'Create', 'Create a duty.'), action('approve', 'Approve', 'Approve a duty.'), action('swap', 'Swap', 'Swap an assignment.')]),
      page('hours-compliance', 'Hours & Compliance', 'Monitor working hours, rest requirements and qualification status.', 'dashboard', [action('review', 'Review', 'Review compliance.'), action('alert', 'Alert', 'Raise a compliance alert.'), action('export', 'Export', 'Export compliance data.')]),
      page('qualification-training', 'Qualification & Training', 'Manage certifications, recurrent training and competency records.', 'timeline', [action('enroll', 'Enroll', 'Enroll a crew member.'), action('schedule', 'Schedule', 'Schedule training.'), action('complete', 'Complete', 'Record completed training.')]),
    ],
  },
  {
    id: 'safety-emergency',
    label: 'Safety & Emergency',
    menuId: 'railway.safety',
    menuTitle: 'SAFETY & EMERGENCY',
    icon: 'shield',
    description: 'Incident command, emergency response, alerts, investigations and safety assurance.',
    subModules: [
      page('incident-command', 'Incident Command', 'Coordinate active railway incidents and response resources.', 'console', [action('open', 'Open', 'Open an incident command record.'), action('escalate', 'Escalate', 'Escalate the response.'), action('dispatch', 'Dispatch', 'Dispatch response resources.'), action('close', 'Close', 'Close the incident.')]),
      page('alert-center', 'Alert Center', 'Operational, infrastructure and safety alerts.', 'dashboard', [action('acknowledge', 'Acknowledge', 'Acknowledge an alert.'), action('mute', 'Mute', 'Mute a non-critical alert.'), action('escalate', 'Escalate', 'Escalate the alert.')]),
      page('investigation-center', 'Investigation Center', 'Investigation workflow, evidence, findings and corrective actions.', 'workflow', [action('open', 'Open', 'Open an investigation.'), action('assign', 'Assign', 'Assign an investigator.'), action('review', 'Review', 'Review findings.'), action('close', 'Close', 'Close the investigation.')]),
      page('emergency-response', 'Emergency Response', 'Emergency procedures, response plans and readiness drills.', 'workflow', [action('activate', 'Activate', 'Activate a response plan.'), action('drill', 'Drill', 'Run a readiness drill.'), action('review', 'Review', 'Review the emergency plan.')]),
    ],
  },
  {
    id: 'performance-intelligence',
    label: 'Performance Intelligence',
    menuId: 'railway.analytics',
    menuTitle: 'PERFORMANCE INTELLIGENCE',
    icon: 'chart',
    description: 'Operational KPIs, punctuality, capacity, reliability and management reporting.',
    subModules: [
      page('operations-kpis', 'Operations KPIs', 'Executive and control-room operational performance indicators.', 'chart', [action('filter', 'Filter', 'Filter KPI scope.'), action('compare', 'Compare', 'Compare periods or services.'), action('export', 'Export', 'Export KPI data.')]),
      page('punctuality-analysis', 'Punctuality Analysis', 'On-time performance, delay attribution and service reliability.', 'chart', [action('analyze', 'Analyze', 'Analyze punctuality.'), action('compare', 'Compare', 'Compare service performance.'), action('export', 'Export', 'Export the analysis.')]),
      page('capacity-planning', 'Capacity Planning', 'Network, station, platform and fleet capacity analysis.', 'chart', [action('model', 'Model', 'Model capacity.'), action('simulate', 'Simulate', 'Simulate operating scenarios.'), action('export', 'Export', 'Export capacity results.')]),
      page('management-reports', 'Management Reports', 'Generate, schedule and distribute operational reports.', 'table', [action('generate', 'Generate', 'Generate a report.'), action('schedule', 'Schedule', 'Schedule report delivery.'), action('download', 'Download', 'Download a report.')]),
    ],
  },
  {
    id: 'administration-security',
    label: 'Administration & Security',
    menuId: 'railway.admin',
    menuTitle: 'ADMINISTRATION & SECURITY',
    icon: 'settings',
    description: 'Identity, access, configuration, audit, integrations and platform security.',
    subModules: [
      page('identity-access', 'Identity & Access', 'Users, roles, permissions and operator access.', 'table', [action('create', 'Create', 'Create an operator account.'), action('edit', 'Edit', 'Edit access.'), action('disable', 'Disable', 'Disable an account.'), action('audit', 'Audit', 'Review access history.')]),
      page('platform-configuration', 'Platform Configuration', 'System-wide configuration, operating rules and feature controls.', 'settings', [action('edit', 'Edit', 'Edit configuration.'), action('validate', 'Validate', 'Validate configuration.'), action('apply', 'Apply', 'Apply approved configuration.')]),
      page('audit-security-log', 'Audit & Security Log', 'Immutable operational, administrative and security activity history.', 'table', [action('filter', 'Filter', 'Filter audit records.'), action('inspect', 'Inspect', 'Inspect an audit record.'), action('export', 'Export', 'Export audit data.')]),
      page('system-integrations', 'System Integrations', 'External systems, APIs, telemetry feeds and integration health.', 'inspector', [action('test', 'Test', 'Test an integration.'), action('configure', 'Configure', 'Configure an integration.'), action('rotate', 'Rotate', 'Rotate integration credentials.'), action('disable', 'Disable', 'Disable an integration.')]),
    ],
  },
];

export const RAILWAY_MODULE_MAP = Object.fromEntries(RAILWAY_MODULES.map((module) => [module.id, module]));
export const RAILWAY_MENU_MAP = Object.fromEntries(RAILWAY_MODULES.map((module) => [module.menuId, module]));
export const RAILWAY_PAGE_MAP = Object.fromEntries(
  RAILWAY_MODULES.flatMap((module) => module.subModules.map((subModule) => [subModule.pageId, { module, subModule }]))
);
export const RAILWAY_SUBMODULE_MAP = Object.fromEntries(
  RAILWAY_MODULES.flatMap((module) => module.subModules.map((subModule) => [subModule.id, { module, subModule }]))
);
