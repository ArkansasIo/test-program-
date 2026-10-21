import { RAILWAY_MODULES } from '../src/railway/railwayModules';
import { RAILWAY_ROUTES } from '../src/railway/railwayRoutes';
import { createRailwayControllerState, executeRailwayCommand } from '../src/railway/railwayController';

const pageIds = RAILWAY_MODULES.flatMap((module) => module.subModules.map((page) => page.pageId));
const actionIds = RAILWAY_MODULES.flatMap((module) => module.subModules.flatMap((page) => page.actions.map((action) => action.id)));

const unique = (values: string[]) => new Set(values).size === values.length;

if (RAILWAY_MODULES.length !== 11) throw new Error(`Expected 11 railway modules, got ${RAILWAY_MODULES.length}`);
if (pageIds.length !== 44) throw new Error(`Expected 44 railway pages, got ${pageIds.length}`);
if (RAILWAY_ROUTES.length !== 44) throw new Error(`Expected 44 railway routes, got ${RAILWAY_ROUTES.length}`);
if (!unique(pageIds)) throw new Error('Duplicate railway page IDs detected');
if (!unique(actionIds)) throw new Error('Duplicate railway action IDs detected');

let state = createRailwayControllerState();
const trainId = state.trains[0]?.id;
if (!trainId) throw new Error('Railway seed data contains no trains');
state = executeRailwayCommand(state, trainId, 'hold');
if (state.trains[0].state !== 'held') throw new Error('Hold command transition failed');
state = executeRailwayCommand(state, trainId, 'dispatch');
if (state.trains[0].state !== 'active') throw new Error('Dispatch command transition failed');

console.log(`Railway smoke test passed: ${RAILWAY_MODULES.length} modules, ${pageIds.length} pages, ${RAILWAY_ROUTES.length} routes.`);
