export type RailwaySignalAspect = 'stop' | 'caution' | 'proceed' | 'dark';

export interface RailwaySignalContext {
  nextSectionAvailable: boolean;
  routeSet: boolean;
  occupiedAhead: boolean;
  failed: boolean;
}

/**
 * Reference signal-aspect evaluator for simulation/UI use.
 * It is not a certified railway signaling implementation.
 */
export function evaluateSignal(context: RailwaySignalContext): RailwaySignalAspect {
  if (context.failed) return 'dark';
  if (!context.routeSet || context.occupiedAhead) return 'stop';
  if (!context.nextSectionAvailable) return 'caution';
  return 'proceed';
}
