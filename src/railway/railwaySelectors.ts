import type { RailwayOperationsSnapshot } from './railwayDomainModels';
import type { RailwayKpis, RailwayTrain } from './railwayModels';

export const selectActiveTrains = (trains: RailwayTrain[]) => trains.filter((train) => train.state === 'active');
export const selectUnacknowledgedAlerts = (alerts: { acknowledged: boolean }[]) => alerts.filter((alert) => !alert.acknowledged);
export const selectDelayedTrains = (trains: RailwayTrain[]) => trains.filter((train) => train.delayMinutes > 0);
export const selectAvailableVehicles = (state: RailwayOperationsSnapshot) => state.vehicles.filter((vehicle) => vehicle.status === 'available');
export const selectOpenWorkOrders = (state: RailwayOperationsSnapshot) => state.maintenance.filter((order) => order.status !== 'completed');
export const selectActiveIncidents = (state: RailwayOperationsSnapshot) => state.incidents.filter((incident) => incident.status !== 'resolved');

export function calculateKpis(trains: RailwayTrain[], current: RailwayKpis): RailwayKpis {
  const delayed = selectDelayedTrains(trains).length;
  const onTime = trains.length === 0 ? 100 : ((trains.length - delayed) / trains.length) * 100;
  return { ...current, activeTrains: selectActiveTrains(trains).length, onTimePercent: Number(onTime.toFixed(1)) };
}
