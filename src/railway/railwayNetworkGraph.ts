import type { RailwayStation, RailwayTrackSection } from './railwayModels';

export interface RailwayNetworkNode {
  id: string;
  type: 'station' | 'junction' | 'control-point';
  name: string;
}

export interface RailwayNetworkEdge {
  id: string;
  from: string;
  to: string;
  trackSectionId: string;
  distanceKm: number;
  speedLimitKph: number;
  state: RailwayTrackSection['state'];
}

export interface RailwayNetworkGraph {
  nodes: RailwayNetworkNode[];
  edges: RailwayNetworkEdge[];
}

export function buildNetworkGraph(
  stations: RailwayStation[],
  sections: RailwayTrackSection[],
): RailwayNetworkGraph {
  const nodes = stations.map((station) => ({
    id: station.id,
    type: 'station' as const,
    name: station.name,
  }));

  const edges = sections.map((section) => ({
    id: `edge:${section.id}`,
    from: section.from,
    to: section.to,
    trackSectionId: section.id,
    distanceKm: 1,
    speedLimitKph: section.speedLimitKph,
    state: section.state,
  }));

  return { nodes, edges };
}

export function findRoute(graph: RailwayNetworkGraph, origin: string, destination: string): string[] {
  if (origin === destination) return [origin];

  const queue: string[][] = [[origin]];
  const visited = new Set<string>([origin]);

  while (queue.length) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    for (const edge of graph.edges) {
      if (edge.state === 'blocked' || edge.state === 'restricted') continue;
      if (edge.from !== current || visited.has(edge.to)) continue;

      const next = [...path, edge.to];
      if (edge.to === destination) return next;
      visited.add(edge.to);
      queue.push(next);
    }
  }

  return [];
}
