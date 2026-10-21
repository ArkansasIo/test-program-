import type { RailwayService, RailwayTimetable } from './railwayDomainModels';

export interface TimetableConflict { serviceA: string; serviceB: string; reason: 'same-path-overlap' | 'minimum-headway' | 'duplicate-platform'; message: string; }

export interface TimetableValidationResult { valid: boolean; conflicts: TimetableConflict[]; warnings: string[]; }

export function validateTimetable(timetable: RailwayTimetable, services: RailwayService[], minimumHeadwayMinutes = 3): TimetableValidationResult {
  const selected = services.filter((service) => timetable.services.includes(service.id));
  const conflicts: TimetableConflict[] = [];
  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      const a = selected[i];
      const b = selected[j];
      if (a.origin === b.origin && Math.abs(toMinutes(a.plannedDeparture) - toMinutes(b.plannedDeparture)) < minimumHeadwayMinutes) {
        conflicts.push({ serviceA: a.id, serviceB: b.id, reason: 'minimum-headway', message: `${a.number} and ${b.number} depart ${a.origin} too closely.` });
      }
      if (a.destination === b.destination && a.plannedArrival === b.plannedArrival) {
        conflicts.push({ serviceA: a.id, serviceB: b.id, reason: 'duplicate-platform', message: `${a.number} and ${b.number} share an identical arrival time at ${a.destination}.` });
      }
    }
  }
  return { valid: conflicts.length === 0, conflicts, warnings: timetable.status === 'published' ? [] : ['Timetable has not been published.'] };
}

export function toMinutes(value: string): number {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours * 60) + minutes;
}

export function cloneTimetable(timetable: RailwayTimetable, version: string): RailwayTimetable {
  return { ...timetable, id: `${timetable.id}-${version}`, version, status: 'draft', publishedAt: undefined };
}
