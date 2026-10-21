import type { RailwayTrain, RailwayTrackSection } from './railwayModels';

export interface RailwayConflict {
  id: string;
  severity: 'warning' | 'critical';
  trainIds: string[];
  sectionId?: string;
  message: string;
}

export function detectTrainConflicts(
  trains: RailwayTrain[],
  sections: RailwayTrackSection[],
): RailwayConflict[] {
  const conflicts: RailwayConflict[] = [];

  for (let i = 0; i < trains.length; i += 1) {
    for (let j = i + 1; j < trains.length; j += 1) {
      const a = trains[i];
      const b = trains[j];
      if (a.currentLocation !== b.currentLocation) continue;
      if (a.state !== 'active' || b.state !== 'active') continue;
      conflicts.push({
        id: `CON-${a.id}-${b.id}`,
        severity: 'critical',
        trainIds: [a.id, b.id],
        message: `${a.id} and ${b.id} are simultaneously active at ${a.currentLocation}.`,
      });
    }
  }

  for (const section of sections) {
    if (section.state === 'blocked') {
      const affected = trains.filter((train) => train.currentLocation === section.id && train.state === 'active');
      if (affected.length) {
        conflicts.push({
          id: `CON-BLOCK-${section.id}`,
          severity: 'critical',
          trainIds: affected.map((train) => train.id),
          sectionId: section.id,
          message: `Active movement detected on blocked section ${section.id}.`,
        });
      }
    }
  }

  return conflicts;
}
