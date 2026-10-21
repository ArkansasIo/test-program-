export type InterlockingState = 'normal' | 'route-set' | 'occupied' | 'failed';

export interface InterlockingRouteRequest {
  id: string;
  originSignalId: string;
  destinationSignalId: string;
  trackSectionIds: string[];
}

export interface InterlockingStateRecord {
  id: string;
  state: InterlockingState;
  activeRouteId?: string;
  lockedSections: string[];
}

export function createInterlocking(id: string): InterlockingStateRecord {
  return { id, state: 'normal', lockedSections: [] };
}

export function canSetRoute(
  interlocking: InterlockingStateRecord,
  request: InterlockingRouteRequest,
  occupiedSections: Set<string>,
): boolean {
  if (interlocking.state === 'failed' || interlocking.state === 'occupied') return false;
  return request.trackSectionIds.every((sectionId) =>
    !occupiedSections.has(sectionId) && !interlocking.lockedSections.includes(sectionId),
  );
}

export function setRoute(
  interlocking: InterlockingStateRecord,
  request: InterlockingRouteRequest,
  occupiedSections: Set<string>,
): InterlockingStateRecord {
  if (!canSetRoute(interlocking, request, occupiedSections)) {
    throw new Error(`Route ${request.id} cannot be set because a protected section is unavailable.`);
  }
  return {
    ...interlocking,
    state: 'route-set',
    activeRouteId: request.id,
    lockedSections: [...request.trackSectionIds],
  };
}

export function releaseRoute(interlocking: InterlockingStateRecord): InterlockingStateRecord {
  return { ...interlocking, state: 'normal', activeRouteId: undefined, lockedSections: [] };
}
