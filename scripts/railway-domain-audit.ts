import { evaluateSignal } from '../src/railway/railwaySignalLogic';
import { canSetRoute, createInterlocking, setRoute } from '../src/railway/railwayInterlocking';
import { buildNetworkGraph, findRoute } from '../src/railway/railwayNetworkGraph';

const stations = [
  { id: 'STA-A', name: 'Central', code: 'CTR', platforms: 4, state: 'open' as const },
  { id: 'STA-B', name: 'North', code: 'NOR', platforms: 2, state: 'open' as const },
];
const sections = [
  { id: 'SEC-01', name: 'Central-North', from: 'STA-A', to: 'STA-B', state: 'available' as const, speedLimitKph: 100 },
];

const graph = buildNetworkGraph(stations, sections);
if (findRoute(graph, 'STA-A', 'STA-B').length !== 2) throw new Error('Network route search failed.');

const interlocking = createInterlocking('IXL-01');
const request = { id: 'ROUTE-01', originSignalId: 'SIG-A', destinationSignalId: 'SIG-B', trackSectionIds: ['SEC-01'] };
if (!canSetRoute(interlocking, request, new Set())) throw new Error('Interlocking availability check failed.');
setRoute(interlocking, request, new Set());

if (evaluateSignal({ nextSectionAvailable: true, routeSet: true, occupiedAhead: false, failed: false }) !== 'proceed') {
  throw new Error('Signal evaluation failed.');
}

console.log('Railway domain audit passed.');
