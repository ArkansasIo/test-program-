import { INITIAL_RAILWAY_DOMAIN_STATE } from '../src/railway/railwayDomainModels';
import { calculateKpis, selectActiveIncidents, selectAvailableVehicles, selectOpenWorkOrders } from '../src/railway/railwaySelectors';
import { createRailwayControllerState, executeRailwayCommand } from '../src/railway/railwayController';
import { assertRailwayConfiguration } from '../src/railway/railwayValidation';

assertRailwayConfiguration();
if (!INITIAL_RAILWAY_DOMAIN_STATE.services.length) throw new Error('No railway services seeded');
if (!INITIAL_RAILWAY_DOMAIN_STATE.routes.length) throw new Error('No railway routes seeded');
if (!selectAvailableVehicles(INITIAL_RAILWAY_DOMAIN_STATE).length) throw new Error('No available fleet records');
if (!selectOpenWorkOrders(INITIAL_RAILWAY_DOMAIN_STATE).length) throw new Error('No maintenance work orders seeded');
if (selectActiveIncidents(INITIAL_RAILWAY_DOMAIN_STATE).length !== 0) throw new Error('Unexpected active incidents in seed state');

let control = createRailwayControllerState();
control = executeRailwayCommand(control, control.trains[0].id, 'hold');
if (control.trains[0].state !== 'held') throw new Error('Hold transition failed');
control = executeRailwayCommand(control, control.trains[0].id, 'reroute');
if (control.trains[0].delayMinutes !== 1) throw new Error('Reroute delay transition failed');
control = executeRailwayCommand(control, control.trains[0].id, 'dispatch');
if (control.trains[0].state !== 'active') throw new Error('Dispatch transition failed');

const kpis = calculateKpis(control.trains, control.kpis);
if (kpis.activeTrains < 1) throw new Error('KPI calculation failed');
console.log('Railway domain smoke test passed.');
